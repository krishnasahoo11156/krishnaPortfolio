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

        // Dynamically load config.js if not already present
        if (typeof window.GEMINI_API_KEYS === 'undefined') {
            var script = document.createElement('script');
            script.src = 'js/config.js';
            script.async = false;
            document.head.appendChild(script);
        }

        /* ── CHAT STATIC REFERENCE DATABASE ── */
        var KRISHNA_DB = {
            personal: {
                name: "Krishna Sahoo",
                role: "Software Developer & Student",
                location: "Mumbai, Maharashtra, India",
                email: "krishnasahoo11156@gmail.com",
                github: "github.com/krishnasahoo11156",
                linkedin: "linkedin.com/in/krishna-sahoo-b3440537a",
                availability: "Open to remote roles globally",
                education: "B.E. in Artificial Intelligence & Data Science at VESIT (2025 – 2029)"
            },
            skills: {
                HTML5: "Semantic structure, ARIA accessibility, forms validation.",
                CSS3: "Layout models (Flexbox, Grid), animations, glassmorphism.",
                JavaScript: "Async programming, fetch, DOM manipulation.",
                React: "Component architecture, hooks, state management.",
                Backend: "Node.js, Express.js routing, middleware.",
                CloudAndDevOps: "Firebase Auth/Firestore, Docker, Google Cloud Run.",
                VersionControl: "Git versioning, feature branching, GitHub collaboration."
            },
            projects: {
                CrisisSync: "AI crisis response coord platform. Built with Flutter, Firebase, Docker, Google Cloud Run. Uses Gemini AI for incident severity scoring.",
                StudySync: "Academic productivity app. Built with React, Vite, Tailwind, Firebase. Pomodoro timer + Web Audio ambient sounds.",
                OnboardingAgent: "Autonomous Developer Onboarding Next.js app built at Syrus 2026. Automates dev environment checks and generates learning paths."
            },
            achievements: {
                GoogleStudyJams: "Ranked Top 80 of 400+ in GDG Cloud track (Oct 2025).",
                UniMergeHackathon: "Winner of UniMerge Hackathon (Apr 2026).",
                Workshops: "VESIT IQAC Prompt-to-Production (Feb 2026), AI Colegion Python (Sep 2025)."
            }
        };

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
        var activeKeyIndex = 0;
        var keysList = [];

        // Fetch keys from environment/config + user overrides
        function getAvailableKeys() {
            var keys = [];
            if (window.GEMINI_API_KEYS && Array.isArray(window.GEMINI_API_KEYS)) {
                window.GEMINI_API_KEYS.forEach(function(k) {
                    if (k && k.trim() !== "" && k.indexOf("YOUR_GEMINI") === -1) {
                        keys.push(k.trim());
                    }
                });
            }
            var userKey = localStorage.getItem('user_gemini_key');
            if (userKey && userKey.trim() !== "") {
                keys.push(userKey.trim());
            }
            return keys;
        }

        keysList = getAvailableKeys();

        /* ── INJECT SETTINGS COG & PANEL ── */
        var header = widget.querySelector('.chat-header');
        if (header && !document.getElementById('chat-settings-toggle')) {
            // Remove redundant close button from DOM
            if (closeBtn && closeBtn.parentNode) {
                closeBtn.parentNode.removeChild(closeBtn);
            }

            var settingsBtn = document.createElement('button');
            settingsBtn.id = 'chat-settings-toggle';
            settingsBtn.className = 'chat-settings-btn cursor-hover';
            settingsBtn.setAttribute('aria-label', 'Open Settings');
            settingsBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
            
            header.appendChild(settingsBtn);

            var settingsPanel = document.createElement('div');
            settingsPanel.className = 'chat-settings-panel';
            settingsPanel.id = 'chat-settings-panel';
            settingsPanel.innerHTML = `
                <h4 class="chat-settings-title">Assistant Settings</h4>
                
                <div class="chat-settings-options">
                    <div class="chat-settings-option-item">
                        <div class="option-info">
                            <span class="option-label">Detailed Answers</span>
                            <span class="option-desc">Get comprehensive explanations and references by default.</span>
                        </div>
                        <label class="chat-switch">
                            <input type="checkbox" id="chat-toggle-detailed-setting">
                            <span class="chat-slider"></span>
                        </label>
                    </div>
                    
                    <div class="chat-settings-option-item">
                        <div class="option-info">
                            <span class="option-label">Clear Conversation</span>
                            <span class="option-desc">Reset conversation history and start a new session.</span>
                        </div>
                        <button class="chat-settings-btn-reset" id="chat-reset-history">Reset</button>
                    </div>
                </div>

                <div class="chat-settings-advanced">
                    <button class="chat-advanced-toggle" id="chat-advanced-toggle">
                        <span>Developer Settings</span>
                        <svg viewBox="0 0 24 24" class="arrow-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    
                    <div class="chat-advanced-content" id="chat-advanced-content">
                        <p class="chat-settings-desc">Provide your Gemini API key to activate live AI answers. If empty, the chat will fall back to local offline search. Keys are kept safely on your machine.</p>
                        <div class="chat-settings-form">
                            <div class="chat-settings-input-group">
                                <label for="chat-api-key-input">Gemini API Key</label>
                                <input type="password" id="chat-api-key-input" placeholder="AIzaSy...">
                            </div>
                            <div class="chat-settings-actions">
                                <button class="chat-settings-btn-save" id="chat-settings-save">Save Key</button>
                                <button class="chat-settings-btn-clear" id="chat-settings-clear">Clear Key</button>
                            </div>
                        </div>
                        <div class="chat-settings-status idle" id="chat-settings-status">Offline mode.</div>
                    </div>
                </div>
            `;
            widget.appendChild(settingsPanel);

            // Handle panel toggle
            settingsBtn.addEventListener('click', function() {
                var isOpen = settingsPanel.classList.toggle('open');
                if (isOpen) {
                    var keyInput = document.getElementById('chat-api-key-input');
                    if (keyInput) keyInput.value = localStorage.getItem('user_gemini_key') || "";
                    updateSettingsStatus();
                    
                    // Sync detailed mode checkbox
                    var settingsSwitch = document.getElementById('chat-toggle-detailed-setting');
                    if (settingsSwitch) {
                        settingsSwitch.checked = isDetailed;
                    }
                }
            });

            // Detailed mode checkbox toggle
            document.getElementById('chat-toggle-detailed-setting').addEventListener('change', function(e) {
                isDetailed = e.target.checked;
                if (plusBtn) {
                    plusBtn.classList.toggle('active', isDetailed);
                    var tooltip = plusBtn.querySelector('.chat-tooltip');
                    if (tooltip) {
                        tooltip.textContent = isDetailed ? "Switch to Normal Mode" : "Switch to Detailed Response";
                    }
                }
            });

            // Clear conversation history
            document.getElementById('chat-reset-history').addEventListener('click', function() {
                sessionStorage.removeItem('ks_chat_history');
                messagesContainer.innerHTML = '';
                initialized = false;
                displayWelcome();
                
                // Visual feedback on button
                var btn = document.getElementById('chat-reset-history');
                var oldText = btn.textContent;
                btn.textContent = "Cleared!";
                btn.style.borderColor = "#22c55e";
                btn.style.color = "#22c55e";
                setTimeout(function() {
                    btn.textContent = oldText;
                    btn.style.borderColor = "";
                    btn.style.color = "";
                }, 1500);
            });

            // Developer settings accordion toggle
            document.getElementById('chat-advanced-toggle').addEventListener('click', function() {
                var advContainer = this.parentNode;
                advContainer.classList.toggle('open');
            });

            // Save key
            document.getElementById('chat-settings-save').addEventListener('click', function() {
                var keyInput = document.getElementById('chat-api-key-input');
                var val = keyInput.value.trim();
                var statusEl = document.getElementById('chat-settings-status');

                if (val === "") {
                    localStorage.removeItem('user_gemini_key');
                    updateSettingsStatus();
                    return;
                }

                statusEl.textContent = "Verifying key...";
                statusEl.className = "chat-settings-status idle";

                fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + val, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: "Ping" }] }] })
                })
                .then(function(res) {
                    if (res.ok) {
                        localStorage.setItem('user_gemini_key', val);
                        statusEl.textContent = "API Key verified & saved successfully!";
                        statusEl.className = "chat-settings-status success";
                        keysList = getAvailableKeys();
                    } else {
                        statusEl.textContent = "Invalid API Key. Please verify and try again.";
                        statusEl.className = "chat-settings-status error";
                    }
                })
                .catch(function() {
                    statusEl.textContent = "Validation request failed. Check internet connection.";
                    statusEl.className = "chat-settings-status error";
                });
            });

            // Clear key
            document.getElementById('chat-settings-clear').addEventListener('click', function() {
                var keyInput = document.getElementById('chat-api-key-input');
                if (keyInput) keyInput.value = "";
                localStorage.removeItem('user_gemini_key');
                updateSettingsStatus();
            });
        }

        function updateSettingsStatus() {
            var statusEl = document.getElementById('chat-settings-status');
            if (!statusEl) return;
            
            keysList = getAvailableKeys();
            if (keysList.length > 0) {
                statusEl.textContent = "Live Gemini Mode active (" + keysList.length + " key(s) loaded).";
                statusEl.className = "chat-settings-status success";
            } else {
                statusEl.textContent = "Offline Mode. (Fallback responding active)";
                statusEl.className = "chat-settings-status idle";
            }
        }

        /* ── CHAT SESSION STORAGE RESTORATION ── */
        function loadHistory() {
            var history = JSON.parse(sessionStorage.getItem('ks_chat_history') || '[]');
            if (history.length > 0) {
                initialized = true;
                history.forEach(function(msg) {
                    appendMessageUI(msg.sender, msg.text, msg.reference, false);
                });
            } else {
                displayWelcome();
            }
        }

        function saveMessageToHistory(sender, text, reference) {
            var history = JSON.parse(sessionStorage.getItem('ks_chat_history') || '[]');
            history.push({ sender: sender, text: text, reference: reference });
            // Keep history limit to 20 messages
            if (history.length > 20) history.shift();
            sessionStorage.setItem('ks_chat_history', JSON.stringify(history));
        }

        function displayWelcome() {
            if (initialized) return;
            initialized = true;
            appendMessageUI('assistant', "Hi there! 👋 I am here to introduce Krishna to you. Ask me any question you would like about his skills, experience, or certifications!", null, true);
        }

        function toggleWidget() {
            var isOpen = widget.classList.contains('open');
            var panel = document.getElementById('chat-settings-panel');
            
            if (isOpen) {
                widget.classList.remove('open');
                toggle.classList.remove('open');
                if (panel) panel.classList.remove('open');
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
                keysList = getAvailableKeys(); // Refresh key list in case config.js finished loading post-boot
                loadHistory();
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
            setTimeout(function() {
                suggestionsContainer.classList.remove('visible');
            }, 250);
        });

        /* Detailed response toggle */
        if (plusBtn) {
            plusBtn.addEventListener('click', function() {
                isDetailed = !isDetailed;
                plusBtn.classList.toggle('active', isDetailed);
                var tooltip = plusBtn.querySelector('.chat-tooltip');
                if (tooltip) {
                    tooltip.textContent = isDetailed ? "Switch to Normal Mode" : "Switch to Detailed Response";
                }
            });
        }

        /* ── VOICE INPUT (NATIVE WEB SPEECH API) ── */
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            var recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = function() {
                isListening = true;
                micBtn.classList.add('listening');
                inputField.placeholder = "Listening (Speak now)...";
                inputField.value = "";
                suggestionsContainer.classList.remove('visible');
            };

            recognition.onresult = function(event) {
                var transcript = "";
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    transcript += event.results[i][0].transcript;
                }
                inputField.value = transcript;
            };

            recognition.onend = function() {
                isListening = false;
                micBtn.classList.remove('listening');
                inputField.placeholder = "Ask a question...";
                
                // Automatically send message on speech end
                setTimeout(function() {
                    if (inputField.value.trim() !== "" && !isListening) {
                        sendMessage();
                    }
                }, 800);
            };

            recognition.onerror = function(event) {
                isListening = false;
                micBtn.classList.remove('listening');
                console.error("SpeechRecognition error: ", event.error);
                if (event.error === 'not-allowed') {
                    inputField.placeholder = "Mic permission denied.";
                } else {
                    inputField.placeholder = "Speech error. Try typing.";
                }
                setTimeout(function() {
                    inputField.placeholder = "Ask a question...";
                }, 3000);
            };

            micBtn.addEventListener('click', function() {
                if (isListening) {
                    recognition.stop();
                } else {
                    try {
                        recognition.start();
                    } catch (e) {
                        console.error("SpeechRecognition already started: ", e);
                    }
                }
            });
        } else {
            // SpeechRecognition not supported in browser
            micBtn.style.opacity = '0.4';
            micBtn.addEventListener('click', function() {
                appendMessageUI('assistant', "Voice recognition is not supported in this browser. Please try typing your question, or use Google Chrome / Microsoft Edge.", null, false);
            });
        }

        /* ── MARKDOWN TO HTML CONVERTER ── */
        function formatMarkdown(text) {
            var lines = text.split('\n');
            var inList = false;
            var result = [];

            lines.forEach(function(line) {
                var cleanLine = line.trim();
                // Check list items
                if (cleanLine.startsWith('•') || cleanLine.startsWith('-') || cleanLine.startsWith('* ')) {
                    var content = cleanLine.replace(/^[•\-*]\s*/, '');
                    content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                                     .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                                     .replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');
                    
                    if (!inList) {
                        result.push('<ul>');
                        inList = true;
                    }
                    result.push('<li>' + content + '</li>');
                } else {
                    if (inList) {
                        result.push('</ul>');
                        inList = false;
                    }
                    if (cleanLine === '') {
                        result.push('<br>');
                    } else {
                        var formatted = cleanLine
                            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                            .replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');
                        result.push('<p>' + formatted + '</p>');
                    }
                }
            });
            if (inList) {
                result.push('</ul>');
            }
            return result.join('');
        }

        /* ── RENDER & ACTION REFERENCE NAVIGATION ── */
        function appendMessageUI(sender, text, reference, save) {
            var wrapper = document.createElement('div');
            wrapper.className = 'chat-bubble-wrapper ' + sender;
            
            var bubble = document.createElement('div');
            bubble.className = 'chat-bubble';
            bubble.innerHTML = formatMarkdown(text);
            wrapper.appendChild(bubble);
            
            if (reference) {
                var refBtn = document.createElement('button');
                refBtn.className = 'chat-reference-btn cursor-hover';
                refBtn.textContent = 'Take me to reference →';
                
                refBtn.addEventListener('click', function() {
                    var parts = reference.split('#');
                    var page = parts[0];
                    var hash = parts[1] || "";
                    
                    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
                    if (currentPage === "" || currentPage === "/") currentPage = 'index.html';
                    
                    if (page === currentPage || (page === 'index.html' && currentPage === 'index.html')) {
                        // Same page scroll
                        var target = document.getElementById(hash);
                        if (target) {
                            // Expand collapsible accordion details
                            if (target.tagName.toLowerCase() === 'details') {
                                target.open = true;
                            } else if (target.closest('details')) {
                                target.closest('details').open = true;
                            }
                            
                            var offset = 80;
                            var top = target.getBoundingClientRect().top + window.scrollY - offset;
                            window.scrollTo({ top: top, behavior: 'smooth' });
                            
                            target.classList.add('reference-flash');
                            setTimeout(function() {
                                target.classList.remove('reference-flash');
                            }, 1800);
                            
                            toggleWidget();
                        }
                    } else {
                        // Cross page navigate
                        sessionStorage.setItem('pending_reference_scroll', hash);
                        navigateTo(page);
                    }
                });
                wrapper.appendChild(refBtn);
            }
            
            var time = document.createElement('div');
            time.className = 'chat-time';
            var now = new Date();
            time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            wrapper.appendChild(time);
            
            messagesContainer.appendChild(wrapper);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            if (save) {
                saveMessageToHistory(sender, text, reference);
            }
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

        /* ── OFFLINE RULE MATCHING FALLBACK ── */
        function getMockResponse(query, detailed) {
            var clean = query.toLowerCase();
            
            if (clean.indexOf('project') !== -1 || clean.indexOf('work') !== -1 || clean.indexOf('app') !== -1) {
                if (detailed) {
                    return {
                        text: "Krishna Sahoo builds full-stack applications with modular component architecture:\n• **CrisisSync**: Live crisis mapping built with Flutter, Firebase, Docker, Google Cloud Run, utilizing Gemini AI for automated classification.\n• **StudySync**: Study workflow site using React, Vite, Tailwind CSS, and Web Audio API for timer soundscapes.\n• **Autonomous Developer Onboarding Agent**: Won Syrus 2026 Hackathon, uses Next.js and environment checking node scripts.",
                        reference: "index.html#projects"
                    };
                }
                return {
                    text: "Krishna Sahoo has built Flutter/Firebase and React full-stack apps (CrisisSync, StudySync, and an Onboarding Agent). Tap reference to see all projects.",
                    reference: "index.html#projects"
                };
            }
            
            if (clean.indexOf('cert') !== -1 || clean.indexOf('jam') !== -1 || clean.indexOf('hackathon') !== -1 || clean.indexOf('award') !== -1 || clean.indexOf('winner') !== -1) {
                if (detailed) {
                    return {
                        text: "Krishna Sahoo's competition track record includes:\n• **Google Study Jams**: Cloud track gdg rank (Top 80 of 400+ participants).\n• **UniMerge Hackathon**: Winner (April 2026).\n• **Syrus Hackathon**: Autonomous dev onboarding agent design recognition (March 2026).\n• **Prompt-to-Production Workshop**: VESIT Python and engineering certificate.",
                        reference: "timeline.html#achievements-toggle"
                    };
                }
                return {
                    text: "Krishna is the winner of UniMerge Hackathon, ranked top 80 of 400+ in Google Study Jams, and was recognized at Syrus Hackathon.",
                    reference: "timeline.html#achievements-toggle"
                };
            }
            
            if (clean.indexOf('skill') !== -1 || clean.indexOf('stack') !== -1 || clean.indexOf('language') !== -1 || clean.indexOf('tech') !== -1) {
                if (detailed) {
                    return {
                        text: "Krishna's core skill set spans three core departments:\n• **Languages**: JavaScript ES6+, Dart, HTML5/CSS3, Python.\n• **Frameworks**: React, Node.js, Express.js, Flutter.\n• **Cloud & DevOps**: Firebase, SQL, Docker containerization, Google Cloud Run.",
                        reference: "index.html#skills"
                    };
                }
                return {
                    text: "Krishna specializes in JS full-stack (React, Node, Express), Flutter, Firebase cloud setups, Docker deployment, and Python.",
                    reference: "index.html#skills"
                };
            }
            
            if (clean.indexOf('who') !== -1 || clean.indexOf('krishna') !== -1 || clean.indexOf('bio') !== -1 || clean.indexOf('background') !== -1) {
                if (detailed) {
                    return {
                        text: "Krishna Sahoo is a Software Developer based in Mumbai, India. He is a B.E. student studying Artificial Intelligence & Data Science at VESIT (2025-2029). He is an SSC academic topper, debate winner, and RSP Silver medalist with a passion for web engineering and automations.",
                        reference: "index.html#about"
                    };
                }
                return {
                    text: "Krishna Sahoo is a software developer and B.E. AI & Data Science undergrad at VESIT, Mumbai, focused on building clean web systems.",
                    reference: "index.html#about"
                };
            }
            
            if (clean.indexOf('contact') !== -1 || clean.indexOf('email') !== -1 || clean.indexOf('hire') !== -1 || clean.indexOf('linkedin') !== -1) {
                if (detailed) {
                    return {
                        text: "To hire or message Krishna Sahoo:\n• **Email**: krishnasahoo11156@gmail.com\n• **LinkedIn**: linkedin.com/in/krishna-sahoo-b3440537a\n• **GitHub**: github.com/krishnasahoo11156\n• Alternatively, fill out the inquiry form directly on the contact section.",
                        reference: "index.html#contact"
                    };
                }
                return {
                    text: "Contact Krishna via email at krishnasahoo11156@gmail.com, connect on LinkedIn, or fill out the contact form below.",
                    reference: "index.html#contact"
                };
            }
            
            if (clean.indexOf('school') !== -1 || clean.indexOf('college') !== -1 || clean.indexOf('vesit') !== -1 || clean.indexOf('education') !== -1 || clean.indexOf('timeline') !== -1) {
                if (detailed) {
                    return {
                        text: "Krishna's academic timeline is fully mapped:\n• **VESIT Undergraduate**: B.E. AI & Data Science (2025 - 2029).\n• **BA Talreja College**: Higher Secondary Merit performer (2022 - 2024).\n• **Gurukul International**: SSC Topper & Debate winner (2016 - 2022).\n• **Jeevan Jyoti English High**: Primary Education (2012 - 2015).",
                        reference: "timeline.html"
                    };
                }
                return {
                    text: "Krishna studies B.E. AI & Data Science at VESIT (2025-2029) and was the SSC Topper at Gurukul International. See the full timeline details.",
                    reference: "timeline.html"
                };
            }

            if (clean.indexOf('resume') !== -1 || clean.indexOf('cv') !== -1 || clean.indexOf('download') !== -1) {
                return {
                    text: "You can download Krishna Sahoo's Resume from the link on the home page or via the FAQ details.",
                    reference: "faq.html#q-resume"
                };
            }

            // General fallback
            if (detailed) {
                return {
                    text: "Thank you for asking! I'm Krishna's AI representative. In detailed mode, I can direct you to exact sections of this site. Ask me about his projects, technical skills, certifications, school chronology, or contact channels.",
                    reference: "faq.html"
                };
            }
            return {
                text: "I am here to represent Krishna. Ask me about his projects, skills, academic timeline, or contact info!",
                reference: "faq.html"
            };
        }

        /* ── LIVE GEMINI API OR FALLBACK DISPATCHER ── */
        function fetchGeminiResponse(query, detailedMode, retryCount) {
            if (retryCount >= keysList.length) {
                // All loaded keys exhausted or rate-limited
                var offline = getMockResponse(query, detailedMode);
                return Promise.resolve(offline);
            }
            
            var apiKey = keysList[(activeKeyIndex + retryCount) % keysList.length];
            var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
            
            var systemPrompt = "You are Krishna's Assistant, a friendly and extremely helpful AI representative for Krishna Sahoo on his personal portfolio website. " +
                "Krishna's profile details: " + JSON.stringify(KRISHNA_DB) + ". " +
                "Format responses with simple, clean markdown (use **bold** for highlights, *italics*, lists, and inline code like `code` tags). Do not use headers (#) or tables. " +
                "Normal mode (detailedMode = false): be brief and concise. Keep responses under 2 sentences. " +
                "Detailed mode (detailedMode = true): provide a thorough, structured response with bullet lists. AND you MUST append a reference target in the format [REFERENCE: page.html#id] at the very end of your response, where page.html#id matches one of these: " +
                "- index.html#about (for general bio, location, age) " +
                "- index.html#skills (for core skill proficiency details) " +
                "- index.html#projects (for CrisisSync, StudySync, or Onboarding Agent) " +
                "- index.html#contact (for email, socials, inquiry form) " +
                "- timeline.html (for high school, college names, educational milestones) " +
                "- timeline.html#achievements-toggle (for Study Jams rank, hackathon wins, workshops) " +
                "- core-foundation.html (for HTML5, CSS3, ES6 JavaScript) " +
                "- frontend-frameworks.html (for React.js, Responsive layout, UI/UX UI) " +
                "- backend-tools.html (for Node.js, Express, Firebase, Git versioning, GitHub) " +
                "- faq.html#q-resume (for downloading resume/CV PDF) " +
                "- faq.html#q-vesit (for B.E. AI & Data Science details) " +
                "- faq.html (for general help or Q&A). Choose the single best reference matching the content.";

            var promptText = query;
            if (detailedMode) {
                promptText += " (Answer thoroughly in detailed mode, and append the appropriate [REFERENCE: page.html#id] tag at the very end)";
            } else {
                promptText += " (Answer concisely in normal mode, under 2 sentences)";
            }

            return fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    generationConfig: { temperature: 0.6, maxOutputTokens: 600 }
                })
            })
            .then(function(res) {
                if (res.status === 429) {
                    console.warn("Gemini API Rate Limit on active key. Rotating index...");
                    return fetchGeminiResponse(query, detailedMode, retryCount + 1);
                }
                if (!res.ok) throw new Error("API status " + res.status);
                return res.json();
            })
            .then(function(data) {
                if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts[0].text) {
                    throw new Error("Invalid response format");
                }
                // Save the successful key index
                activeKeyIndex = (activeKeyIndex + retryCount) % keysList.length;
                var replyText = data.candidates[0].content.parts[0].text;
                
                // Parse out reference
                var refRegex = /\[REFERENCE:\s*([^\]]+)\]/i;
                var match = replyText.match(refRegex);
                var reference = null;
                var cleanText = replyText;
                
                if (match) {
                    reference = match[1].trim();
                    cleanText = replyText.replace(refRegex, "").trim();
                }
                
                return { text: cleanText, reference: reference };
            })
            .catch(function(err) {
                console.error("Gemini API error: ", err);
                if (retryCount + 1 < keysList.length) {
                    return fetchGeminiResponse(query, detailedMode, retryCount + 1);
                }
                // If all fails, fall back to offline database
                return getMockResponse(query, detailedMode);
            });
        }

        function sendMessage() {
            var query = inputField.value.trim();
            if (!query) return;
            
            var detailedModeActive = isDetailed; // Capture detailed state before resetting
            
            keysList = getAvailableKeys(); // Re-read keys list before dispatching API request
            appendMessageUI('user', query, null, true);
            inputField.value = "";
            suggestionsContainer.classList.remove('visible');
            
            showTypingIndicator();
            
            if (keysList.length > 0) {
                fetchGeminiResponse(query, detailedModeActive, 0)
                .then(function(reply) {
                    removeTypingIndicator();
                    appendMessageUI('assistant', reply.text, detailedModeActive ? reply.reference : null, true);
                });
            } else {
                // Offline Local Fallback
                setTimeout(function() {
                    removeTypingIndicator();
                    var reply = getMockResponse(query, detailedModeActive);
                    appendMessageUI('assistant', reply.text, detailedModeActive ? reply.reference : null, true);
                }, 800);
            }

            if (isDetailed) {
                isDetailed = false;
                plusBtn.classList.remove('active');
                var tooltip = plusBtn.querySelector('.chat-tooltip');
                if (tooltip) {
                    tooltip.textContent = "Switch to Detailed Response";
                }
                var settingsSwitch = document.getElementById('chat-toggle-detailed-setting');
                if (settingsSwitch) {
                    settingsSwitch.checked = false;
                }
            }
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

    function checkPendingReference() {
        var pending = sessionStorage.getItem('pending_reference_scroll');
        if (pending) {
            sessionStorage.removeItem('pending_reference_scroll');
            setTimeout(function() {
                var target = document.getElementById(pending);
                if (target) {
                    if (target.tagName.toLowerCase() === 'details') {
                        target.open = true;
                    } else if (target.closest('details')) {
                        target.closest('details').open = true;
                    }
                    var offset = 80;
                    var top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                    
                    target.classList.add('reference-flash');
                    setTimeout(function() {
                        target.classList.remove('reference-flash');
                    }, 1800);
                }
            }, 800);
        }
    }

    function boot() {
        initLoader();
        initScrollProgress();
        initChatWidget();
        initCursor();
        initHamburger();
        checkPendingReference();
    }
})();
