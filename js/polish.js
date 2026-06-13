/* ================================================================
   POLISH.JS — Scroll progress, back-to-top, custom cursor,
               hamburger menu, page load sequence
   ================================================================ */
(function () {
    'use strict';

    /* ── 1. PAGE LOAD SEQUENCE — 4-Phase Cinematic Loader ── */
    function initLoader() {
        var loader  = document.getElementById('page-loader');
        var ksEl    = document.getElementById('loader-ks');
        var lineEl  = document.getElementById('loader-line');
        var roleEl  = document.getElementById('loader-role');
        var navbar  = document.querySelector('.navbar');
        var heroFg  = document.querySelector('.hero-layer-fg') ||
                      document.querySelector('#home');

        // Check sessionStorage — skip if already shown this session
        // Override with ?loader=true in URL
        var forceShow = window.location.search.indexOf('loader=true') !== -1;
        var alreadySeen = sessionStorage.getItem('ks_loader_done');

        if (!loader) return;

        if (alreadySeen && !forceShow) {
            // Skip loader: instantly reveal everything
            loader.style.display = 'none';
            document.body.classList.remove('loading');
            if (navbar) navbar.classList.add('nav-visible');
            if (heroFg) heroFg.closest('#home') && heroFg.closest('#home').classList.add('hero-content-visible');
            return;
        }

        // Mark body as loading to hide content
        document.body.classList.add('loading');

        var ROLE_TEXT = 'SOFTWARE DEVELOPER';
        var roleIndex = 0;
        var typeInterval;

        function typeRole() {
            if (roleIndex <= ROLE_TEXT.length) {
                roleEl.textContent = ROLE_TEXT.slice(0, roleIndex);
                roleIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }

        function exitLoader() {
            // Phase 4a: collapse line
            lineEl.classList.remove('expand');
            lineEl.classList.add('collapse');

            // Phase 4b: fade role text
            setTimeout(function () {
                roleEl.classList.add('fade-out');
            }, 110);

            // Phase 4c: fade KS
            setTimeout(function () {
                ksEl.classList.add('fade-out');
            }, 220);

            // Phase 4d: curtain slides UP
            setTimeout(function () {
                loader.classList.add('exiting');

                // Reveal content
                document.body.classList.remove('loading');

                // Navbar slides down
                if (navbar) navbar.classList.add('nav-visible');

                // Hero content rises in
                var heroSection = document.getElementById('home');
                if (heroSection) heroSection.classList.add('hero-content-visible');

                // Remove loader from DOM after exit transition
                setTimeout(function () {
                    if (loader.parentNode) loader.parentNode.removeChild(loader);
                    sessionStorage.setItem('ks_loader_done', '1');
                }, 750);

            }, 350);
        }

        // ── PHASE 1 (0ms → 400ms): KS fades in, letter-spacing tightens ──
        setTimeout(function () {
            ksEl.classList.add('visible');
        }, 60); // small delay so transition fires

        // ── PHASE 2 (400ms → 900ms): Line grows + role types ──
        setTimeout(function () {
            lineEl.classList.add('expand');
            roleIndex = 0;
            typeInterval = setInterval(typeRole, 40);
        }, 400);

        // ── PHASE 3 (900ms → 1400ms): Hold + gentle KS pulse ──
        setTimeout(function () {
            clearInterval(typeInterval);
            roleEl.textContent = ROLE_TEXT; // ensure complete
            ksEl.classList.add('pulse');
            ksEl.addEventListener('animationend', function () {
                ksEl.classList.remove('pulse');
            }, { once: true });
        }, 900);

        // ── PHASE 4 (1400ms → 2200ms): Exit ──
        // Wait for DOMContentLoaded if page hasn't loaded yet
        if (document.readyState === 'complete') {
            setTimeout(exitLoader, 1400);
        } else {
            var exitScheduled = false;
            var exitAt = Date.now() + 1400;

            window.addEventListener('load', function () {
                var remaining = exitAt - Date.now();
                setTimeout(exitLoader, Math.max(remaining, 0));
                exitScheduled = true;
            });

            // Fallback: if 2.5s passes and still loading, force exit
            setTimeout(function () {
                if (!exitScheduled) exitLoader();
            }, 2500);
        }
    }

    /* ── 2. SCROLL PROGRESS BAR ── */
    function initScrollProgress() {
        var bar = document.getElementById('scroll-progress');
        if (!bar) return;

        window.addEventListener('scroll', function () {
            var scrollTop  = window.scrollY || document.documentElement.scrollTop;
            var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
            var pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = pct + '%';
        }, { passive: true });
    }

    /* ── 3. CHAT WIDGET ── */
    function initChatWidget() {
        var toggle = document.getElementById('chat-toggle');
        var widget = document.getElementById('chat-widget');
        var closeBtn = document.getElementById('chat-widget-close');
        var messagesContainer = document.getElementById('chat-messages');
        var suggestionsContainer = document.getElementById('chat-suggestions-container');
        var suggestionsInner = document.getElementById('chat-suggestions');
        var inputField = document.getElementById('chat-input');
        var sendBtn = document.getElementById('chat-send-btn');
        var micBtn = document.getElementById('chat-mic-btn');
        var plusBtn = document.getElementById('chat-plus-btn');

        if (!toggle || !widget) return;

        var priorQuestions = [
            "Who is Krishna Sahoo?",
            "What projects has Krishna built?",
            "Where is Krishna based?",
            "What certifications does Krishna have?",
            "What skills does Krishna possess?",
            "How can I contact Krishna?"
        ];

        var lastValidInput = "";
        var lastMatches = priorQuestions;
        var isDetailed = false;
        var initialized = false;
        var isListening = false;

        function displayWelcome() {
            if (initialized) return;
            initialized = true;
            appendMessage('assistant', "Hi there! 👋 I am here to introduce Krishna to you. Ask me any question you would like about his skills, experience, or certifications!");
        }

        function toggleWidget() {
            var isOpen = widget.classList.contains('open');
            if (isOpen) {
                widget.classList.remove('open');
                toggle.classList.remove('open');
                widget.setAttribute('aria-hidden', 'true');
                var chatPath = toggle.querySelector('.chat-path');
                var closePath = toggle.querySelector('.close-path');
                if (chatPath && closePath) {
                    chatPath.style.display = 'block';
                    closePath.style.display = 'none';
                }
            } else {
                widget.classList.add('open');
                toggle.classList.add('open');
                widget.setAttribute('aria-hidden', 'false');
                var chatPath = toggle.querySelector('.chat-path');
                var closePath = toggle.querySelector('.close-path');
                if (chatPath && closePath) {
                    chatPath.style.display = 'none';
                    closePath.style.display = 'block';
                }
                displayWelcome();
                setTimeout(function() {
                    inputField.focus();
                }, 300);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }

        toggle.addEventListener('click', toggleWidget);
        if (closeBtn) closeBtn.addEventListener('click', toggleWidget);

        /* Suggestions Rendering */
        function renderSuggestions(questions) {
            suggestionsInner.innerHTML = '';
            if (questions.length === 0) {
                suggestionsContainer.classList.remove('visible');
                return;
            }
            questions.forEach(function (q) {
                var chip = document.createElement('button');
                chip.className = 'chat-suggestion-chip cursor-hover';
                chip.textContent = q;
                chip.addEventListener('click', function () {
                    inputField.value = q;
                    sendMessage();
                    suggestionsContainer.classList.remove('visible');
                });
                suggestionsInner.appendChild(chip);
            });
            suggestionsContainer.classList.add('visible');
        }

        /* Suggestions search logic with graduated opacity fade */
        inputField.addEventListener('input', function() {
            var val = inputField.value.trim().toLowerCase();
            
            if (!val) {
                lastValidInput = "";
                lastMatches = priorQuestions;
                suggestionsContainer.style.opacity = '1';
                renderSuggestions(priorQuestions);
                return;
            }
            
            var matches = priorQuestions.filter(function(q) {
                return q.toLowerCase().indexOf(val) !== -1;
            });
            
            if (matches.length > 0) {
                lastValidInput = val;
                lastMatches = matches;
                suggestionsContainer.style.opacity = '1';
                renderSuggestions(matches);
            } else {
                // Graduate opacity decrease based on non-matching letters
                var mismatchCount = val.length - lastValidInput.length;
                var opacity = Math.max(0, 1 - (mismatchCount * 0.3));
                
                if (opacity <= 0) {
                    suggestionsContainer.classList.remove('visible');
                    suggestionsContainer.style.opacity = '0';
                } else {
                    suggestionsContainer.classList.add('visible');
                    suggestionsContainer.style.opacity = opacity;
                    renderSuggestions(lastMatches);
                }
            }
        });

        inputField.addEventListener('focus', function() {
            var val = inputField.value.trim().toLowerCase();
            if (!val) {
                suggestionsContainer.style.opacity = '1';
                renderSuggestions(priorQuestions);
            }
        });

        inputField.addEventListener('blur', function() {
            // Slight timeout so click event on suggestions can fire before list hides
            setTimeout(function() {
                suggestionsContainer.classList.remove('visible');
            }, 250);
        });

        /* Detailed response toggle */
        if (plusBtn) {
            plusBtn.addEventListener('click', function() {
                isDetailed = !isDetailed;
                plusBtn.classList.toggle('active', isDetailed);
            });
        }

        /* Microphone voice search simulator */
        if (micBtn) {
            micBtn.addEventListener('click', function() {
                if (isListening) return;
                isListening = true;
                micBtn.classList.add('listening');
                inputField.placeholder = "Listening...";
                inputField.value = "";
                suggestionsContainer.classList.remove('visible');
                
                var mockSpeech = "What certifications does Krishna have?";
                var index = 0;
                
                setTimeout(function() {
                    inputField.placeholder = "Transcribing...";
                    var typeInterval = setInterval(function() {
                        if (index < mockSpeech.length) {
                            inputField.value += mockSpeech[index];
                            index++;
                        } else {
                            clearInterval(typeInterval);
                            setTimeout(function() {
                                micBtn.classList.remove('listening');
                                inputField.placeholder = "Ask a question...";
                                isListening = false;
                                sendMessage();
                            }, 500);
                        }
                    }, 40);
                }, 1200);
            });
        }

        /* Message appending */
        function appendMessage(sender, text, hasProjectBtn) {
            var wrapper = document.createElement('div');
            wrapper.className = 'chat-bubble-wrapper ' + sender;
            
            var bubble = document.createElement('div');
            bubble.className = 'chat-bubble';
            bubble.innerHTML = text;
            wrapper.appendChild(bubble);
            
            if (hasProjectBtn) {
                var btn = document.createElement('button');
                btn.className = 'chat-project-btn cursor-hover';
                btn.innerHTML = 'Explore Projects &rarr;';
                btn.addEventListener('click', function() {
                    // Check if on index.html
                    var isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || !window.location.pathname.includes('.html');
                    if (isIndex) {
                        var target = document.getElementById('projects');
                        if (target) {
                            var top = target.getBoundingClientRect().top + window.scrollY - 80;
                            window.scrollTo({ top: top, behavior: 'smooth' });
                            toggleWidget(); // Close chat
                        }
                    } else {
                        window.location.href = 'index.html#projects';
                    }
                });
                wrapper.appendChild(btn);
            }
            
            var time = document.createElement('div');
            time.className = 'chat-time';
            var now = new Date();
            time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            wrapper.appendChild(time);
            
            messagesContainer.appendChild(wrapper);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        /* Typing indicator */
        var typingIndicator = null;
        function showTypingIndicator() {
            typingIndicator = document.createElement('div');
            typingIndicator.className = 'chat-bubble-wrapper assistant';
            typingIndicator.innerHTML = '<div class="chat-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>';
            messagesContainer.appendChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function removeTypingIndicator() {
            if (typingIndicator && typingIndicator.parentNode) {
                typingIndicator.parentNode.removeChild(typingIndicator);
            }
            typingIndicator = null;
        }

        /* Mock Response selector */
        function getMockResponse(query, detailed) {
            var clean = query.toLowerCase();
            
            if (clean.indexOf('project') !== -1) {
                if (detailed) {
                    return {
                        text: "Krishna is a passionate developer who builds full-stack applications. Some of his highlights include:<br>1. <strong>Syrus Hackathon Project</strong> - An Autonomous Developer Onboarding Agent.<br>2. <strong>GitHub Stats Dashboard</strong> - Visualizes commits, repos, and languages in real-time.<br>3. <strong>Vite/React Templates</strong> - Fine-tuned modular layout components.<br>Use the button below to see the interactive portfolio items!",
                        hasProjects: true
                    };
                }
                return {
                    text: "Krishna has built several full-stack applications and AI workflows, including an Autonomous Developer Onboarding Agent. Tap below to see the full list of projects!",
                    hasProjects: true
                };
            }
            
            if (clean.indexOf('cert') !== -1 || clean.indexOf('licens') !== -1) {
                if (detailed) {
                    return {
                        text: "Krishna's certifications include:<br>• <strong>Google Study Jams 2025</strong> - Cloud/Developer track, ranking in the top 80 of 400+ participants.<br>• <strong>VESIT IQAC Workshops</strong> - Certificate of completion in Prompt-to-Production and Python.<br>• <strong>Hackathon Awards</strong> - Winner of UniMerge Hackathon.<br>He is preparing a visual Certifications gallery section to add to this site very soon!",
                        hasProjects: false
                    };
                }
                return {
                    text: "Krishna is certified in Cloud/Google Developer tracks via Google Study Jams (Top 80 of 400+ participants) and has completed multiple Python & Prompt Engineering certifications at VESIT. He'll be adding a certificates gallery to this site soon!",
                    hasProjects: false
                };
            }
            
            if (clean.indexOf('skill') !== -1 || clean.indexOf('tech') !== -1) {
                if (detailed) {
                    return {
                        text: "Krishna's core skill set spans multiple layers:<br>• <strong>Languages:</strong> JavaScript (ES6+), Python, HTML5, CSS3.<br>• <strong>Frameworks:</strong> React, Node.js, Express.<br>• <strong>Databases & Cloud:</strong> Firebase, SQL.<br>• <strong>AI/Data Science:</strong> Prompt engineering, data analysis, automations.",
                        hasProjects: false
                    };
                }
                return {
                    text: "Krishna specializes in Javascript web development (React, Node.js, Express), Firebase, Python, and Artificial Intelligence & Data Science architectures.",
                    hasProjects: false
                };
            }
            
            if (clean.indexOf('who') !== -1 || clean.indexOf('krishna') !== -1) {
                if (detailed) {
                    return {
                        text: "Krishna Sahoo is a Software Developer and student based in Mumbai, India. He is currently pursuing his B.E. in Artificial Intelligence & Data Science at Vivekanand Education Society's Institute of Technology (VESIT). He is an SSC topper and RSP Silver medalist with a passion for automations.",
                        hasProjects: false
                    };
                }
                return {
                    text: "Krishna Sahoo is a Software Developer from Mumbai, India, specializing in full-stack web engineering and AI implementations. He is currently studying AI & Data Science at VESIT.",
                    hasProjects: false
                };
            }
            
            if (clean.indexOf('contact') !== -1 || clean.indexOf('email') !== -1 || clean.indexOf('hire') !== -1) {
                if (detailed) {
                    return {
                        text: "You can reach Krishna through these channels:<br>• <strong>Email:</strong> krishnasahoo11156@gmail.com<br>• <strong>LinkedIn:</strong> linkedin.com/in/krishna-sahoo-b3440537a<br>• <strong>GitHub:</strong> github.com/krishnasahoo11156<br>Feel free to fill out the form in the Contact section to message him directly!",
                        hasProjects: false
                    };
                }
                return {
                    text: "You can mail Krishna at krishnasahoo11156@gmail.com, connect via LinkedIn, or use the Contact form at the bottom of the page.",
                    hasProjects: false
                };
            }
            
            if (clean.indexOf('where') !== -1 || clean.indexOf('location') !== -1) {
                return {
                    text: "Krishna is based in Mumbai, Maharashtra, India. He is open to remote roles worldwide.",
                    hasProjects: false
                };
            }
            
            // Fallback response
            if (detailed) {
                return {
                    text: "Thank you for asking! I'm Krishna's AI representative. Currently, I can tell you all about his projects (with navigation support), certificates, technical skill stack, academic timeline, or contact info. Try asking 'What projects has he built?'",
                    hasProjects: false
                };
            }
            return {
                text: "I'm here to introduce Krishna to you. Ask me about his projects, skills, certifications, or how to contact him!",
                hasProjects: false
            };
        }

        function sendMessage() {
            var query = inputField.value.trim();
            if (!query) return;
            
            appendMessage('user', query);
            inputField.value = "";
            suggestionsContainer.classList.remove('visible');
            
            showTypingIndicator();
            
            setTimeout(function() {
                removeTypingIndicator();
                var reply = getMockResponse(query, isDetailed);
                appendMessage('assistant', reply.text, reply.hasProjects);
                
                if (isDetailed) {
                    isDetailed = false;
                    plusBtn.classList.remove('active');
                }
            }, 1000);
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', sendMessage);
        }
        inputField.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    /* ── 4. CUSTOM CURSOR ── */
    function initCursor() {
        // Only on devices that support hover (desktops)
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        var dot  = document.getElementById('cursor-dot');
        var ring = document.getElementById('cursor-ring');
        if (!dot || !ring) return;

        var ringX = 0, ringY = 0;
        var mouseX = 0, mouseY = 0;
        var rafId;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left  = mouseX + 'px';
            dot.style.top   = mouseY + 'px';
        });

        // Ring follows with lag
        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';
            rafId = requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover state for interactive elements
        var interactives = 'a, button, [onclick], input, textarea, select, label, .proj-card, .skill-card, .cs-link';
        document.querySelectorAll(interactives).forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', function () {
                document.body.classList.remove('cursor-hover');
            });
        });

        // Hide ring when cursor leaves window
        document.addEventListener('mouseleave', function () {
            dot.style.opacity  = '0';
            ring.style.opacity = '0';
        });
        document.addEventListener('mouseenter', function () {
            dot.style.opacity  = '1';
            ring.style.opacity = '1';
        });
    }

    /* ── 5. HAMBURGER MENU ── */
    function initHamburger() {
        var hamburger = document.getElementById('nav-hamburger');
        var overlay   = document.getElementById('nav-mobile-overlay');
        var closeBtn  = document.getElementById('nav-mobile-close');
        if (!hamburger || !overlay) return;

        var overlayLinks = overlay.querySelectorAll('a');

        function openMenu() {
            hamburger.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            hamburger.setAttribute('aria-expanded', 'true');
        }

        function closeMenu() {
            hamburger.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        }

        hamburger.addEventListener('click', function () {
            if (overlay.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (closeBtn) closeBtn.addEventListener('click', closeMenu);

        // Close on link click
        overlayLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu();
                // Smooth scroll with offset
                var href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    var target = document.querySelector(href);
                    if (target) {
                        setTimeout(function () {
                            var top = target.getBoundingClientRect().top + window.scrollY - 80;
                            window.scrollTo({ top: top, behavior: 'smooth' });
                        }, 350);
                    }
                }
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('open')) {
                closeMenu();
                hamburger.focus();
            }
        });
    }

    /* ── BOOT ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    function boot() {
        initLoader();
        initScrollProgress();
        initChatWidget();
        initCursor();
        initHamburger();
    }
})();
