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
                Code2Git: "Chrome extension syncing solved DSA questions from LeetCode, GFG, HackerRank, and Codeforces to GitHub. Secure commits via GitHub REST API and OAuth 2.0.",
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
                
                var isExternal = reference.startsWith('http://') || reference.startsWith('https://') || reference.startsWith('mailto:');
                
                if (isExternal) {
                    var btnText = "Visit Link →";
                    if (reference.indexOf('instagram.com') !== -1) {
                        btnText = "Krishna's Instagram Account";
                    } else if (reference.indexOf('linkedin.com') !== -1) {
                        btnText = "Krishna's LinkedIn Profile";
                    } else if (reference.indexOf('github.com') !== -1) {
                        btnText = "Krishna's GitHub Profile";
                    } else if (reference.startsWith('mailto:')) {
                        btnText = "Send Krishna an Email";
                    }
                    refBtn.textContent = btnText;
                    
                    refBtn.addEventListener('click', function() {
                        window.open(reference, '_blank', 'noopener,noreferrer');
                    });
                } else {
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
                }
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

        /* ── CHAT STATIC REFERENCE DATABASE FOR OFFLINE CLASSIFIER ── */
        var OFFLINE_TOPICS = [
            {
                id: 'greeting',
                keywords: ['hi', 'hello', 'hey', 'greetings', 'morning', 'evening', 'sup', 'yo', 'assistant', 'representative'],
                text: "Hello! I am Krishna's AI Assistant. I'm here to represent him and answer any questions you have about his skills, projects, experience, or achievements. How can I help you today?",
                reference: null
            },
            {
                id: 'thanks',
                keywords: ['thank', 'thanks', 'cool', 'awesome', 'great', 'perfect', 'ok', 'okay'],
                text: "You're very welcome! Be sure to connect with Krishna if you have any questions or collaboration ideas.",
                reference: null
            },
            {
                id: 'instagram',
                keywords: ['instagram', 'insta', 'ig', 'social'],
                text: "You can find and follow Krishna on Instagram where he shares his journey, project snippets, and developer updates. Click the button below to visit his profile!",
                reference: "https://instagram.com/krishnasahoo11156"
            },
            {
                id: 'linkedin',
                keywords: ['linkedin', 'linked-in', 'profile', 'social', 'network', 'career'],
                text: "Krishna is active on LinkedIn for professional networking, collaborations, and career discussions. Click the button below to view his profile and connect with him!",
                reference: "https://linkedin.com/in/krishna-sahoo-b3440537a"
            },
            {
                id: 'github',
                keywords: ['github', 'git-hub', 'repo', 'repositories', 'code', 'commit', 'source', 'projects'],
                text: "Explore Krishna's open-source projects, source code, and developer commits directly on GitHub. Click the button below to view his repositories!",
                reference: "https://github.com/krishnasahoo11156"
            },
            {
                id: 'email',
                keywords: ['email', 'gmail', 'mail', 'contact', 'reach', 'message', 'hire', 'write', 'inquiry'],
                text: "You can reach out to Krishna directly via email at **krishnasahoo11156@gmail.com** or by filling out the contact form at the bottom of the page. Click below to write him an email!",
                reference: "mailto:krishnasahoo11156@gmail.com"
            },
            {
                id: 'resume',
                keywords: ['resume', 'cv', 'download', 'pdf', 'hiring', 'experience'],
                text: "Krishna's professional resume is available for viewing and downloading. It includes a comprehensive summary of his academic records, skills, and hackathon projects. Click the button below to navigate to the download link.",
                reference: "faq.html#q-resume"
            },
            {
                id: 'unimerge',
                keywords: ['unimerge', 'uni-merge', 'hackathon winner'],
                text: "Krishna won the prestigious **UniMerge Hackathon** in April 2026! He was recognized as the champion for building complex system integrations and scalable automations under intense competition pressure.",
                reference: "timeline.html#achievements-toggle"
            },
            {
                id: 'code2git',
                keywords: ['code2git', 'code-2-git', 'chrome extension', 'leetcode sync', 'gfg sync', 'hackerrank sync', 'codeforces sync', 'github sync', 'dsa sync'],
                text: "Krishna built **Code2Git** — a Chrome extension that automatically pushes solved DSA questions from LeetCode, GeeksforGeeks, HackerRank, and Codeforces directly to a GitHub repository. It scrapes successful submissions from the page, parses statistics, auto-structures them inside the repository, and pushes them securely via the GitHub REST API using OAuth 2.0.",
                reference: "index.html#projects"
            },
            {
                id: 'crisissync',
                keywords: ['crisissync', 'crisis-sync', 'crisis response', 'disaster', 'flutter map'],
                text: "Krishna built **CrisisSync** — a full-stack real-time crisis response and emergency coordination platform. It utilizes a Flutter frontend, a Firebase backend (Auth/Realtime Database), and is containerized using Docker and deployed on Google Cloud Run. It leverages Gemini AI to automatically score report severity and display active coordination metrics on live maps.",
                reference: "index.html#projects"
            },
            {
                id: 'studysync',
                keywords: ['studysync', 'study-sync', 'study app', 'productivity', 'pomodoro'],
                text: "Krishna built **StudySync** — a comprehensive academic productivity dashboard. Developed with React.js, Vite, Tailwind CSS, and Firebase, it features a calendar with automatic conflict resolution, a Pomodoro timer backed by Web Audio API ambient soundscapes (rain, lofi beats), and a cloud file manager.",
                reference: "index.html#projects"
            },
            {
                id: 'onboarding',
                keywords: ['onboarding', 'onboard', 'onboarding agent', 'syrus', 'developer onboarding', 'autonomous agent'],
                text: "Developed at Syrus 2026, the **Autonomous Developer Onboarding Agent** automates day-one configurations. It features a lightweight node script to check local software installations, a Gemini AI assistant to answer questions, and an HR monitoring dashboard built with Chart.js, Next.js, and TypeScript.",
                reference: "index.html#projects"
            },
            {
                id: 'vesit',
                keywords: ['vesit', 'college', 'university', 'education', 'degree', 'study', 'major', 'academics', 'timeline'],
                text: "Krishna is pursuing a Bachelor of Engineering (B.E.) in **Artificial Intelligence & Data Science** at Vivekanand Education Society's Institute of Technology (**VESIT**), Mumbai (2025–2029). He maintains a strong focus on software engineering, AI, and advanced data systems.",
                reference: "timeline.html"
            },
            {
                id: 'studyjams',
                keywords: ['studyjams', 'study jams', 'gdg', 'google study jams', 'cloud track'],
                text: "Krishna ranked in the **Top 80 of 400+ participants** in the Google Study Jams (GDG Cloud Track) in October 2025, demonstrating early proficiency in Google Cloud systems.",
                reference: "timeline.html#achievements-toggle"
            },
            {
                id: 'skills',
                keywords: ['skill', 'skills', 'stack', 'languages', 'programming', 'know', 'tech', 'learn', 'frontend', 'backend', 'devops'],
                text: "Krishna's technical stack spans:\n• **Languages**: JavaScript ES6+, Dart, HTML5/CSS3, Python.\n• **Frameworks**: React.js, Node.js, Express, Flutter.\n• **Cloud & Systems**: Firebase, Docker, Google Cloud Run, SQL database systems.\n• **Workflows**: Git version control, GitHub collaboration.",
                reference: "index.html#skills"
            },
            {
                id: 'achievements',
                keywords: ['achievement', 'achievements', 'win', 'won', 'competition', 'hackathon', 'award', 'certificate', 'trophy'],
                text: "Krishna's competitive achievements include:\n• **UniMerge Hackathon**: Winner (April 2026)\n• **Syrus Hackathon**: Autonomous dev agent recognition (March 2026)\n• **Google Study Jams**: Top 80 of 400+ (October 2025)\n• Multiple Python engineering certificates and workshops.",
                reference: "timeline.html#achievements-toggle"
            },
            {
                id: 'projects',
                keywords: ['project', 'projects', 'build', 'work', 'codebase', 'applications', 'portfolio'],
                text: "Krishna's highlighted projects include:\n• **CrisisSync**: Live Flutter/Docker crisis coordinator mapped with Gemini AI.\n• **StudySync**: Pomodoro & soundscape study dashboard (React/Vite).\n• **Code2Git**: Chrome extension syncing DSA solutions from LeetCode/GFG/HackerRank/Codeforces to GitHub.\n• **Autonomous Developer Onboarding Agent**: Won Syrus 2026 hackathon recognition.\n• Click below to unfold his portfolio projects.",
                reference: "index.html#projects"
            },
            {
                id: 'about',
                keywords: ['who is', 'krishna', 'sahoo', 'background', 'about', 'bio', 'personal', 'where', 'location'],
                text: "Krishna Sahoo is a Software Developer and undergrad AI & Data Science student at VESIT, Mumbai. He is a passionate system builder, SSC topper, debate winner, and RSP Silver medalist with a goal to craft smart, automated web solutions.",
                reference: "index.html#about"
            },
            {
                id: 'certificates',
                keywords: ['certificate', 'certificates', 'certification', 'certifications', 'credential', 'credentials', 'aws', 'google cloud', 'deeplearning', 'gdg', 'python certificate'],
                text: "Krishna Sahoo holds several technical certifications, including:\n• **AWS Certified Cloud Practitioner** (Amazon Web Services)\n• **Google Cloud Certified - Associate Cloud Engineer** (Google Cloud)\n• **Neural Networks & Deep Learning** (DeepLearning.AI)\n• **Google Study Jams Cloud Track** (GDG - Top 80 of 400+)\n• **Certified Associate in Python Programming** (Python Institute)\n• Click the button below to view his certificates in detail.",
                reference: "certificates.html"
            }
        ];

        function findBestOfflineResponse(query) {
            var clean = query.toLowerCase().trim();
            if (!clean) return null;

            var bestTopic = null;
            var maxScore = 0;

            for (var i = 0; i < OFFLINE_TOPICS.length; i++) {
                var topic = OFFLINE_TOPICS[i];
                var score = 0;

                for (var j = 0; j < topic.keywords.length; j++) {
                    var kw = topic.keywords[j];
                    
                    if (clean === kw) {
                        score += 15; // Exact match is highest priority
                    } else if (clean.indexOf(kw) !== -1) {
                        score += kw.length; // Proportional to keyword length
                        
                        // Word boundary bonus
                        var regex = new RegExp('\\b' + kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
                        if (regex.test(clean)) {
                            score += 5;
                        }
                    }
                }

                if (score > maxScore) {
                    maxScore = score;
                    bestTopic = topic;
                }
            }

            if (maxScore > 0 && bestTopic) {
                return {
                    text: bestTopic.text,
                    reference: bestTopic.reference
                };
            }

            // Fallback suggestions
            return {
                text: "I want to give you a clever answer, but I couldn't find a direct match. As Krishna's Assistant, I can tell you about:\n" +
                      "• Projects like **CrisisSync**, **StudySync**, **Code2Git**, or the **Onboarding Agent**\n" +
                      "• Hackathons like the **UniMerge Hackathon** or **Syrus Hackathon**\n" +
                      "• How to connect on **Instagram**, **LinkedIn**, or **GitHub**\n" +
                      "• His academic background at **VESIT** or download his **Resume**.\n\n" +
                      "What would you like to know?",
                reference: "faq.html"
            };
        }

        /* ── LIVE GEMINI API OR FALLBACK DISPATCHER ── */
        function fetchGeminiResponse(query, detailedMode, retryCount) {
            if (retryCount >= keysList.length) {
                // All loaded keys exhausted or rate-limited
                var offline = findBestOfflineResponse(query);
                return Promise.resolve(offline);
            }
            
            var apiKey = keysList[(activeKeyIndex + retryCount) % keysList.length];
            var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
            
            var systemPrompt = "You are Krishna's Assistant, a friendly, extremely intelligent, and witty AI representative for Krishna Sahoo on his personal portfolio website. " +
                "You must act as if you are Krishna's actual personal assistant responding on his behalf. Be polite, engaging, and professional. " +
                "Krishna's profile details: " + JSON.stringify(KRISHNA_DB) + ". " +
                "Format responses with simple, clean markdown (use **bold** for highlights, *italics*, lists, and inline code like `code` tags). Do not use headers (#) or tables. " +
                "Normal mode (detailedMode = false): be brief and concise. Keep responses under 2-4 sentences. " +
                "Detailed mode (detailedMode = true): provide a thorough, structured response with bullet lists. AND you MUST append a reference target in the format [REFERENCE: target] at the very end of your response, where target matches one of these: " +
                "- index.html#about (for general bio, location, age) " +
                "- index.html#skills (for core skill proficiency details) " +
                "- index.html#projects (for CrisisSync, StudySync, Code2Git, or Onboarding Agent) " +
                "- index.html#certificates (for AWS, Google Cloud, DeepLearning.AI credentials) " +
                "- certificates.html (for detailed certificates syllabus and credential IDs) " +
                "- index.html#contact (for email, socials, inquiry form) " +
                "- timeline.html (for high school, college names, educational milestones) " +
                "- timeline.html#achievements-toggle (for Study Jams rank, hackathon wins, workshops) " +
                "- core-foundation.html (for HTML5, CSS3, ES6 JavaScript) " +
                "- frontend-frameworks.html (for React.js, Responsive layout, UI/UX UI) " +
                "- backend-tools.html (for Node.js, Express, Firebase, Git versioning, GitHub) " +
                "- faq.html#q-resume (for downloading resume/CV PDF) " +
                "- faq.html#q-vesit (for B.E. AI & Data Science details) " +
                "- faq.html#q-code2git (for Code2Git Chrome extension details) " +
                "- faq.html (for general help or Q&A). Choose the single best reference matching the content. " +
                "CRITICAL: If the user asks for a specific social media account or link (such as Instagram, LinkedIn, GitHub, or direct Email), you MUST set the reference to the direct URL in [REFERENCE: url] format, where url is one of: " +
                "- https://instagram.com/krishnasahoo11156 (Instagram) " +
                "- https://linkedin.com/in/krishna-sahoo-b3440537a (LinkedIn) " +
                "- https://github.com/krishnasahoo11156 (GitHub) " +
                "- mailto:krishnasahoo11156@gmail.com (Email)";

            var promptText = query;
            if (detailedMode) {
                promptText += " (Answer thoroughly as Krishna's personal AI Assistant, and append the appropriate [REFERENCE: target] tag at the very end)";
            } else {
                promptText += " (Answer cleverly and specifically as Krishna's personal AI Assistant, in 2 to 4 sentences)";
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
                return findBestOfflineResponse(query);
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
                    appendMessageUI('assistant', reply.text, (detailedModeActive || (reply.reference && (reply.reference.startsWith('http') || reply.reference.startsWith('mailto')))) ? reply.reference : null, true);
                });
            } else {
                // Offline Local Fallback
                setTimeout(function() {
                    removeTypingIndicator();
                    var reply = findBestOfflineResponse(query);
                    appendMessageUI('assistant', reply.text, (detailedModeActive || (reply.reference && (reply.reference.startsWith('http') || reply.reference.startsWith('mailto')))) ? reply.reference : null, true);
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

    function initCertificates() {
        // 1. Data array
        // 1. Data array
        const certificatesData = [
          // GCP Compute (id 1)
          {
            id: 1,
            image: "certificates/the-basics-of-google-cloud-compute-skill-badge.png",
            title: "The Basics of Google Cloud Compute",
            type: "Skill Badge",
            issuer: "Google Cloud",
            issuerLogo: "logos/googlecloudlogo.png",
            issuerLogos: ["logos/googlecloudlogo.png"],
            issuerColor: "#4285F4",
            date: "October 11, 2025",
            expiry: "No Expiration",
            credentialId: "791d9cf7-ada1-4f00-a153-384baba249c6",
            credentialUrl: "https://www.credly.com/earner/earned/badge/791d9cf7-ada1-4f00-a153-384baba249c6",
            about: "Validates hands-on proficiency with Google Cloud Compute Engine — the backbone of GCP infrastructure. Covers virtual machine creation and management, persistent disk configuration, and web server deployment at scale. Earned by completing a series of lab-based challenges in a live GCP environment.",
            skills: ["Compute Engine", "Virtual Machines", "Web Servers", "Persistent Disks"],
            timelinePos: 5,
            timelineLabel: "Oct 11",
            timelineYear: "2025",
            shortIssuer: "GCP",
            tag: "Cloud Infrastructure",
            status: "active",
            syllabus: [
              "Module 1: Creating and Configuring Virtual Machines",
              "Module 2: Managing Persistent Disks and Storage",
              "Module 3: Deploying Web Servers on Compute Engine",
              "Module 4: Load Balancing and Auto-scaling VMs"
            ]
          },
          // GCP Network (id 3)
          {
            id: 3,
            image: "certificates/set-up-a-google-cloud-network-skill-badge.png",
            title: "Set Up a Google Cloud Network",
            type: "Skill Badge",
            issuer: "Google Cloud",
            issuerLogo: "logos/googlecloudlogo.png",
            issuerLogos: ["logos/googlecloudlogo.png"],
            issuerColor: "#4285F4",
            date: "October 23, 2025",
            expiry: "No Expiration",
            credentialId: "8afbf4ee-14ac-458e-aa05-3178624998c4",
            credentialUrl: "https://www.credly.com/earner/earned/badge/8afbf4ee-14ac-458e-aa05-3178624998c4",
            about: "Validates practical skills in setting up and securing cloud networking infrastructure on Google Cloud Platform. Covers VPC configuration, firewall rules, IAM access control, and database migration strategies — core competencies for any cloud infrastructure or DevOps role.",
            skills: ["Cloud Computing", "Database Migration", "IAM", "VPC Networks", "Firewall Rules"],
            timelinePos: 15,
            timelineLabel: "Oct 23",
            shortIssuer: "GCP",
            tag: "Cloud Networking",
            status: "active",
            syllabus: [
              "Module 1: VPC Network Creation and Routing",
              "Module 2: Configuring Firewall Rules and IAM Roles",
              "Module 3: Database Migration and VPC Peering",
              "Module 4: Network Load Balancers and Cloud NAT"
            ]
          },
          // GCP Data (id 2)
          {
            id: 2,
            image: "certificates/store-process-and-manage-data-on-google-cloud-conso.png",
            title: "Store, Process, and Manage Data on Google Cloud - Console",
            type: "Skill Badge",
            issuer: "Google Cloud",
            issuerLogo: "logos/googlecloudlogo.png",
            issuerLogos: ["logos/googlecloudlogo.png"],
            issuerColor: "#4285F4",
            date: "October 24, 2025",
            expiry: "No Expiration",
            credentialId: "61f13aee-bad7-462b-85a6-529fc2c36b13",
            credentialUrl: "https://www.credly.com/earner/earned/badge/61f13aee-bad7-462b-85a6-529fc2c36b13",
            about: "Demonstrates the ability to store, process, and manage structured and unstructured data on Google Cloud using the Console interface. Covers Cloud Storage buckets, Cloud Functions triggers, Pub/Sub messaging pipelines, and image processing workflows — all deployed without writing code, purely through GCP's Console UI.",
            skills: ["Cloud Storage", "Google Cloud Compute", "Image Processing", "Pub/Sub", "Cloud Functions"],
            timelinePos: 25,
            timelineLabel: "Oct 24",
            shortIssuer: "GCP",
            tag: "Cloud Storage & Data",
            status: "active",
            syllabus: [
              "Module 1: Managing Cloud Storage Buckets and Access Control",
              "Module 2: Setting up Cloud Functions Event Triggers",
              "Module 3: Creating Pub/Sub Topics and Subscriptions",
              "Module 4: Automating Image Processing Workflows via Console"
            ]
          },
          // GCP Pub/Sub (id 8)
          {
            id: 8,
            image: "certificates/get-started-with-pub-sub-skill-badge.png",
            title: "Get Started with Pub/Sub",
            type: "Skill Badge",
            issuer: "Google Cloud",
            issuerLogo: "logos/googlecloudlogo.png",
            issuerLogos: ["logos/googlecloudlogo.png"],
            issuerColor: "#4285F4",
            date: "October 24, 2025",
            expiry: "No Expiration",
            credentialId: "850b86a8-c29a-412e-982c-d9c9e6912345",
            credentialUrl: "https://www.credly.com/earner/earned/badge/850b86a8-c29a-412e-982c-d9c9e6912345",
            about: "Validates foundational knowledge of Google Cloud Pub/Sub service for asynchronous messaging. Covers topic creation, subscription management, publishing and pulling messages, and integration with Cloud Functions and Dataflow pipelines.",
            skills: ["Google Cloud Platform (GCP)", "Pub/Sub", "Asynchronous Messaging", "Event-Driven Architecture"],
            timelinePos: 35,
            timelineLabel: "Oct 24",
            shortIssuer: "GCP",
            tag: "Cloud Messaging",
            status: "active",
            syllabus: [
              "Module 1: Pub/Sub Architecture and Core Concepts",
              "Module 2: Creating Topics and Managing Subscriptions",
              "Module 3: Publishing and Pulling Messages via Console and CLI",
              "Module 4: Integrating Pub/Sub with Cloud Functions"
            ]
          },
          // GCP Vertex AI (id 4)
          {
            id: 4,
            image: "certificates/prompt-design-in-vertex-ai-skill-badge.png",
            title: "Prompt Design in Vertex AI",
            type: "Skill Badge",
            issuer: "Google Cloud",
            issuerLogo: "logos/googlecloudlogo.png",
            issuerLogos: ["logos/googlecloudlogo.png"],
            issuerColor: "#4285F4",
            date: "October 25, 2025",
            expiry: "No Expiration",
            credentialId: "98dc94d6-fa5a-4b4d-a5c2-70a468371fef",
            credentialUrl: "https://www.credly.com/earner/earned/badge/98dc94d6-fa5a-4b4d-a5c2-70a468371fef",
            about: "Covers the fundamentals of prompt engineering using Google Cloud's Vertex AI platform and Gemini APIs. Explores zero-shot, few-shot, and chain-of-thought prompting techniques, and how to apply them inside production-grade AI pipelines using Vertex AI Studio — directly relevant to AI/ML application development.",
            skills: ["Artificial Intelligence", "Generative AI", "Prompt Engineering", "Gemini APIs", "Vertex AI"],
            timelinePos: 45,
            timelineLabel: "Oct 25",
            shortIssuer: "GCP",
            tag: "Generative AI",
            status: "active",
            syllabus: [
              "Module 1: Foundations of Prompt Engineering",
              "Module 2: Zero-shot, Few-shot, and Chain-of-thought Prompting",
              "Module 3: Vertex AI Studio No-Code Experimentation",
              "Module 4: Integrating Gemini APIs in Application Code"
            ]
          },
          // GCP Monitoring (id 5)
          {
            id: 5,
            image: "certificates/monitoring-in-google-cloud-skill-badge.png",
            title: "Monitoring in Google Cloud",
            type: "Skill Badge",
            issuer: "Google Cloud",
            issuerLogo: "logos/googlecloudlogo.png",
            issuerLogos: ["logos/googlecloudlogo.png"],
            issuerColor: "#4285F4",
            date: "October 25, 2025",
            expiry: "No Expiration",
            credentialId: "eb892802-2f47-441e-8817-437a8988e944",
            credentialUrl: "https://www.credly.com/earner/earned/badge/eb892802-2f47-441e-8817-437a8988e944",
            about: "Demonstrates the ability to set up observability and monitoring solutions on GCP using Cloud Monitoring, Logging, and dashboards. Covers alerting policies, uptime checks, metrics explorers, and log-based metrics — essential for maintaining production reliability on Google Cloud infrastructure.",
            skills: ["Google Cloud Platform (GCP)", "Cloud Monitoring", "Dashboard", "Alerting", "Cloud Logging"],
            timelinePos: 55,
            timelineLabel: "Oct 25",
            shortIssuer: "GCP",
            tag: "Cloud Observability",
            status: "active",
            syllabus: [
              "Module 1: Setting up Cloud Monitoring Dashboards",
              "Module 2: Configuring Alerting Policies and Notification Channels",
              "Module 3: Creating Uptime Checks and Synthetics",
              "Module 4: Custom Log-based Metrics and Querying in Cloud Logging"
            ]
          },
          // GCP GenAI Apps with Gemini and Streamlit (id 9)
          {
            id: 9,
            image: "certificates/develop-genai-apps-with-gemini-and-streamlit-skill-.png",
            title: "Develop GenAI Apps with Gemini and Streamlit",
            type: "Skill Badge",
            issuer: "Google Cloud",
            issuerLogo: "logos/googlecloudlogo.png",
            issuerLogos: ["logos/googlecloudlogo.png"],
            issuerColor: "#4285F4",
            date: "October 26, 2025",
            expiry: "No Expiration",
            credentialId: "9ae87d12-321a-4abf-b3cd-91a78e52cde3",
            credentialUrl: "https://www.credly.com/earner/earned/badge/9ae87d12-321a-4abf-b3cd-91a78e52cde3",
            about: "Demonstrates the ability to build and deploy Generative AI applications using Google Cloud's Gemini API and Streamlit framework. Covers application architecture, API integration, session state handling, and deploying interactive AI prototypes.",
            skills: ["Generative AI", "Gemini API", "Streamlit", "Python Development", "App Prototyping"],
            timelinePos: 65,
            timelineLabel: "Oct 26",
            shortIssuer: "GCP",
            tag: "AI App Development",
            status: "active",
            syllabus: [
              "Module 1: Designing GenAI App Architecture with Streamlit",
              "Module 2: Direct Integration with Gemini API and Vertex AI SDK",
              "Module 3: Handling Application State and Multi-Turn Chat Sessions",
              "Module 4: Deploying Streamlit Prototypes to Cloud Run"
            ]
          },
          // Hack-AI-Thon Certificate (id 12)
          {
            id: 12,
            image: "certificates/hackaithoncertificate.png",
            title: "Hack-AI-Thon 2026",
            type: "Hackathon Participation",
            issuer: "AI Colegion VESIT",
            issuerLogo: "logos/ai-colegion.png",
            issuerLogos: ["logos/ai-colegion.png"],
            issuerColor: "#8b5cf6",
            date: "January 28, 2026",
            expiry: "No Expiration",
            credentialId: "AIC-2026-HACK",
            credentialUrl: null,
            about: "Certificate of participation in Hack-AI-Thon 2026, a 24-hour national level AI-themed hackathon organized by AI Colegion at VESIT. Developed innovative solutions by leveraging artificial intelligence and machine learning to address real-world problems.",
            skills: ["Generative AI", "Artificial Intelligence", "Python", "Machine Learning", "Rapid Prototyping"],
            timelinePos: 70,
            timelineLabel: "Jan 28",
            timelineYear: "2026",
            shortIssuer: "AI Colegion",
            tag: "Hackathon",
            status: "completed",
            syllabus: [
              "Phase 1: Idea Submission & Feasibility Review",
              "Phase 2: 24-Hour Hackathon Build Phase",
              "Phase 3: Prototype Deployment & Pitch Presentation",
              "Phase 4: Evaluation by Industry Experts"
            ]
          },
          // CodeCell Syrus Hackathon (id 10)
          {
            id: 10,
            image: "certificates/codecell's-syrus-hackathon.png",
            title: "Syrus Hackathon 2026 (Top 6 Finalist)",
            type: "Hackathon Finalist",
            issuer: "CodeCell VESIT",
            issuerLogo: "logos/codecell.png",
            issuerLogos: ["logos/codecell.png"],
            issuerColor: "#ffbf00",
            date: "March 18, 2026",
            expiry: "No Expiration",
            credentialId: "VESIT_2025_26_UID-0256",
            credentialUrl: "https://verification.givemycertificate.com/v/563de96d-f546-4d9c-bf14-9faa752f3285",
            about: "Awarded for participating and securing a spot in the Top 6 Finalists at Syrus Hackathon 2026. Built an Autonomous Developer Onboarding Agent that automates environment setup, dependency verification, and day-one guidance using Gemini AI, Next.js, and TypeScript. Sponsored by Rezinix.ai, Unstop, GitHub, and associate sponsors Interview Buddy, .xyz, Interview Cake, and Archer.",
            skills: ["Autonomous Agents", "Next.js", "TypeScript", "Gemini AI", "App Development", "DevOps Automation"],
            timelinePos: 75,
            timelineLabel: "Mar 18",
            timelineYear: "2026",
            shortIssuer: "CodeCell",
            tag: "Hackathon Achievement",
            status: "completed",
            syllabus: [
              "Project Milestone: Built an Autonomous Developer Onboarding Agent",
              "Technical Stack: Next.js, TypeScript, Gemini AI, NextAuth, Framer Motion, Chart.js",
              "Standing: Top 6 Finalists out of all competing teams",
              "Sponsors & Partners: Rezinix.ai (Title Sponsor), Unstop (Powered By), GitHub (Brand Partner)",
              "Associate Sponsors: Interview Buddy, .xyz, Interview Cake, The Daily Dough, Archer"
            ]
          },
          // UniMerge 1.0 Hackathon (id 11)
          {
            id: 11,
            image: "certificates/unimergecertificate.png",
            title: "UniMerge 1.0 Hackathon (Winner)",
            type: "Hackathon Winner",
            issuer: "parth.builds Community",
            issuerLogo: "logos/parth-builds.png.jpeg",
            issuerLogos: ["logos/parth-builds.png.jpeg"],
            issuerColor: "#6C5CE7",
            date: "April 12, 2026",
            expiry: "No Expiration",
            credentialId: null,
            credentialUrl: null,
            about: "Awarded for securing the 1st Place Winner position in the UniMerge 1.0 Solo Online Hackathon organized by the parth.builds Community. Developed StudySync — an academic productivity platform with smart scheduling, Pomodoro timers, and Web Audio ambient sound generation.",
            skills: ["React.js", "Vite", "Firebase", "Web Audio API", "Academic Productivity", "Solo Development"],
            timelinePos: 79,
            timelineLabel: "Apr 12",
            timelineYear: "2026",
            shortIssuer: "parth.builds",
            tag: "Hackathon Winner",
            status: "completed",
            syllabus: [
              "Hackathon Winner: Secured 1st Place out of all solo competitors",
              "Project Developed: StudySync (Smart Calendar, Focus Timer, Cloud Library)",
              "Organizer: Parth Narkar (Creator of parth.builds Community)",
              "Judges: Kanhayya Gupta (Founder of FME) & Somanath Diksangi (Founder of Vidgenn)"
            ]
          },
          // AWS DevOps (id 7)
          {
            id: 7,
            image: "certificates/fundamentals of devops on aws.png",
            title: "Fundamentals of DevOps On AWS",
            type: "Completion Certificate",
            issuer: "AWS × Simplilearn",
            issuerLogo: "logos/awslogo.png",
            issuerLogos: ["logos/awslogo.png", "logos/simplilearnlogo.png"],
            issuerColor: "#FF9900",
            date: "June 10, 2026",
            expiry: "No Expiration",
            credentialId: "10329571",
            credentialUrl: null,
            about: "Introduces core DevOps principles and how they are implemented in the AWS ecosystem. Covers CI/CD pipelines using AWS CodePipeline, CodeBuild, and CodeDeploy, along with infrastructure automation using CloudFormation, monitoring with CloudWatch, and containerization with ECS. Bridges the gap between software development and cloud operations.",
            skills: ["DevOps", "AWS CodePipeline", "CI/CD", "CloudFormation", "CloudWatch", "ECS"],
            timelinePos: 83,
            timelineLabel: "Jun 10",
            timelineYear: "2026",
            shortIssuer: "AWS",
            tag: "DevOps & Cloud Operations",
            status: "completed",
            syllabus: [
              "Module 1: DevOps Principles on AWS Platform",
              "Module 2: CI/CD Pipelines with CodePipeline & CodeBuild",
              "Module 3: Infrastructure as Code (IaC) with CloudFormation",
              "Module 4: Container Orchestration with ECS and EKS",
              "Module 5: Monitoring and Logging using CloudWatch"
            ]
          },
          // GCP GenAI Studio (id 6)
          {
            id: 6,
            image: "certificates/introduction to generative ai studio.png",
            title: "Introduction to Generative AI Studio",
            type: "Completion Certificate",
            issuer: "Google Cloud × Simplilearn",
            issuerLogo: "logos/googlecloudlogo.png",
            issuerLogos: ["logos/googlecloudlogo.png", "logos/simplilearnlogo.png"],
            issuerColor: "#4285F4",
            date: "June 15, 2026",
            expiry: "No Expiration",
            credentialId: "10349500",
            credentialUrl: null,
            about: "Covers the capabilities and practical usage of Google Cloud's Generative AI Studio — a no-code/low-code interface for experimenting with foundation models like Gemini. Explores model tuning, prompt testing, multimodal inputs, and deploying generative AI applications. Completed through the Simplilearn SkillUp platform powered by Google Cloud.",
            skills: ["Generative AI", "Vertex AI Studio", "Foundation Models", "Gemini", "Prompt Testing"],
            timelinePos: 93,
            timelineLabel: "Jun 15",
            shortIssuer: "GCP",
            tag: "Generative AI",
            status: "completed",
            syllabus: [
              "Module 1: Introduction to Foundation Models & Vertex AI",
              "Module 2: Tuning and Prompt Engineering in Generative AI Studio",
              "Module 3: Integrating Multimodal Datasets with Gemini Models",
              "Module 4: Model Evaluation and Deployment Best Practices"
            ]
          }
        ];

        // Populate detailed catalog if on certificates.html page
        const detailGrid = document.querySelector('.certs-detail-grid');
        if (detailGrid) {
            detailGrid.innerHTML = certificatesData.map(cert => {
                const credentialIdText = cert.credentialId ? cert.credentialId : "N/A";
                const verifyButton = cert.credentialUrl 
                    ? `<a href="${cert.credentialUrl}" target="_blank" rel="noopener" class="cert-verify-btn">Verify Credential &rarr;</a>`
                    : `<div class="cert-verify-btn" style="opacity: 0.6; cursor: default; border-color: var(--border-color); color: var(--text-secondary); background: transparent;">🏅 Simplilearn Verified</div>`;

                const statusClass = cert.status === 'active' ? 'active' : 'completed';
                const statusLabel = cert.status === 'active' ? 'Active' : 'Completed';

                const syllabusHtml = cert.syllabus && cert.syllabus.length > 0 
                    ? `
                    <details class="cert-syllabus-accordion">
                        <summary class="cert-syllabus-summary">View Syllabus Modules</summary>
                        <div class="cert-syllabus-content">
                            <ul class="cert-syllabus-list">
                                ${cert.syllabus.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    </details>
                    `
                    : '';

                return `
                    <div class="cert-detail-card">
                        <div class="cert-detail-header">
                            <div class="cert-logo-container" style="display: flex; gap: 8px; align-items: center; justify-content: center; width: auto; height: 52px; min-width: 52px; padding: 6px 12px;">
                                ${cert.issuerLogos.map(logo => `<img src="${logo}" alt="" class="cert-detail-logo" style="width: 32px; height: 32px; object-fit: contain; border-radius: 4px;" onerror="this.style.display='none';" />`).join('')}
                            </div>
                            <span class="cert-status-badge ${statusClass}">${statusLabel}</span>
                        </div>
                        <div class="cert-detail-tag">${cert.tag || 'Cloud'}</div>
                        <h3 class="cert-detail-title">${cert.title}</h3>
                        <div class="cert-detail-meta">
                            <span class="cert-meta-item">Issuer: <strong>${cert.issuer}</strong></span>
                            <span class="cert-meta-item">Credential ID: <strong style="word-break: break-all;">${credentialIdText}</strong></span>
                            <span class="cert-meta-item">Issued: <strong>${cert.date}</strong></span>
                        </div>
                        <p class="cert-detail-desc">${cert.about}</p>
                        <div class="cert-skills-wrap">
                            <div class="cert-skills-label">Skills Verified</div>
                            <div class="cert-skills-list">
                                ${cert.skills.map(s => `<span class="cert-skill-tag">${s}</span>`).join('')}
                            </div>
                        </div>
                        ${syllabusHtml}
                        ${verifyButton}
                    </div>
                `;
            }).join('');

            // Click listener to open certificate image lightbox
            detailGrid.addEventListener('click', function(e) {
                // Ignore if clicked on links, buttons, or details summary/accordion elements
                if (e.target.closest('a') || e.target.closest('.cert-verify-btn') || e.target.closest('details')) {
                    return; 
                }

                const card = e.target.closest('.cert-detail-card');
                if (card) {
                    const titleEl = card.querySelector('.cert-detail-title');
                    if (titleEl) {
                        const titleText = titleEl.textContent.trim();
                        const cert = certificatesData.find(c => c.title === titleText);
                        if (cert) {
                            openCertificateModal(cert.image, cert.title);
                        }
                    }
                }
            });
        }

        var track = document.querySelector('.certs-track');
        if (!track) return;

        // 2. Build certificate cards
        const doubledData = [...certificatesData, ...certificatesData];
        track.innerHTML = doubledData.map((cert, index) => `
            <div class="cert-card" data-index="${index}" data-id="${cert.id}">
                <div class="cert-image-wrapper">
                    <img 
                        src="${cert.image}" 
                        alt="${cert.title}" 
                        onerror="this.style.display='none'; this.parentElement.style.background='#1a1a1a';"
                    />
                </div>
                <div class="cert-body">
                    <div class="cert-header-row">
                        <div class="cert-issuer">
                            ${cert.issuerLogos.map(logo => `<img src="${logo}" alt="" onerror="this.style.display='none'" />`).join('')}
                            <span>${cert.issuer}</span>
                        </div>
                        <div class="cert-type-badge">${cert.type}</div>
                    </div>
                    <div class="cert-title">${cert.title}</div>
                    <div class="cert-meta">
                        🗓 <span>${cert.date}</span><br/>
                        🔑 ID: <span title="${cert.credentialId}">${cert.credentialId}</span>
                    </div>
                    <div class="cert-cta">
                        ${cert.credentialUrl 
                            ? `<a href="${cert.credentialUrl}" target="_blank" rel="noopener">Take me to the URL to view the credential ↗</a>`
                            : `<div class="cert-cta-disabled">🏅 Simplilearn Verified</div>`
                        }
                    </div>
                </div>
            </div>
        `).join('');

        // Click listener to open certificate image lightbox
        track.addEventListener('click', function(e) {
            // Ignore if clicked on links or buttons inside the card
            if (e.target.closest('a') || e.target.closest('.cert-cta') || e.target.closest('.cert-cta-disabled')) {
                return;
            }

            const card = e.target.closest('.cert-card');
            if (card) {
                const cardId = parseInt(card.getAttribute('data-id'));
                const cert = certificatesData.find(c => c.id === cardId);
                if (cert) {
                    openCertificateModal(cert.image, cert.title);
                }
            }
        });

        // 3. Render Timeline Axis Nodes
        const timelineNodesContainer = document.querySelector('.certs-timeline-nodes');
        const timelineAxis = document.querySelector('.certs-timeline-axis');
        if (timelineNodesContainer) {
            // Sort to render chronologically
            const chronologicalCerts = [...certificatesData].sort((a, b) => a.timelinePos - b.timelinePos);
            
            timelineNodesContainer.innerHTML = chronologicalCerts.map((cert, index) => {
                const pos = 5 + (index * 90) / (chronologicalCerts.length - 1);
                return `
                <div class="certs-timeline-node" style="left: ${pos}%;" data-id="${cert.id}">
                    <img class="certs-timeline-logo" src="${cert.issuerLogo}" alt="${cert.issuer}" onerror="this.style.display='none'" />
                    <div class="certs-timeline-dot"></div>
                    <div class="certs-timeline-label">
                        ${cert.timelineLabel}<br/>
                        <span style="font-size: 8px; color: ${cert.issuerColor || '#e8473f'}; font-weight: 700;">${cert.shortIssuer}</span>
                    </div>
                </div>
                `;
            }).join('');
        }

        // 4. Pauses scroll on hover
        track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
        track.addEventListener('mouseleave', () => {
            if (!track.classList.contains('manual-paused')) {
                track.style.animationPlayState = 'running';
            }
        });

        // 5. Card 3D Tilt and Shadow Glow Effects
        const cards = document.querySelectorAll('.cert-card');
        cards.forEach(card => {
            const cardId = parseInt(card.getAttribute('data-id'));
            const cert = certificatesData.find(c => c.id === cardId);
            const glowColor = cert ? cert.issuerColor : '#e8473f';
            
            // Set dynamic CSS properties for glow colors
            let shadowColor = 'rgba(232, 71, 63, 0.18)'; 
            if (glowColor.startsWith('#')) {
                const r = parseInt(glowColor.substring(1, 3), 16);
                const g = parseInt(glowColor.substring(3, 5), 16);
                const b = parseInt(glowColor.substring(5, 7), 16);
                shadowColor = `rgba(${r}, ${g}, ${b}, 0.25)`;
            }
            card.style.setProperty('--glow-shadow', shadowColor);
            card.style.setProperty('--glow-color', glowColor);

            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; 
                const y = e.clientY - rect.top;  
                
                const width = rect.width;
                const height = rect.height;
                
                const px = (x / width) - 0.5;
                const py = (y / height) - 0.5;
                
                const maxTilt = 10;
                const tiltX = -py * maxTilt;
                const tiltY = px * maxTilt;
                
                const shineX = (x / width) * 100;
                const shineY = (y / height) * 100;
                
                card.style.setProperty('--tilt-x', tiltX);
                card.style.setProperty('--tilt-y', tiltY);
                card.style.setProperty('--shine-x', shineX);
                card.style.setProperty('--shine-y', shineY);
                
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', function () {
                card.style.transition = 'transform 0.5s ease, box-shadow 0.35s ease, border-color 0.35s ease';
                card.style.setProperty('--tilt-x', 0);
                card.style.setProperty('--tilt-y', 0);
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                
                setTimeout(() => {
                    card.style.transition = '';
                }, 500);
            });

            card.addEventListener('mouseenter', function () {
                card.style.transition = 'transform 0.15s ease, box-shadow 0.35s ease, border-color 0.35s ease';
            });
        });

        // 6. Interactive Timeline click behavior
        const timelineNodes = document.querySelectorAll('.certs-timeline-node');
        let resumeTimeout = null;

        timelineNodes.forEach(node => {
            node.addEventListener('click', function() {
                const targetId = parseInt(node.getAttribute('data-id'));
                
                // Clear previous active states
                timelineNodes.forEach(n => n.classList.remove('active'));
                node.classList.add('active');

                // Find corresponding card in track (first instance)
                const targetCard = Array.from(cards).find(c => parseInt(c.getAttribute('data-id')) === targetId);
                if (targetCard) {
                    const cardIndex = parseInt(targetCard.getAttribute('data-index'));
                    
                    // Stop marquee animation
                    track.style.animation = 'none';
                    track.classList.add('manual-paused');
                    
                    // Calculate step distance (card width 420px + gap 32px)
                    const cardWidth = 420;
                    const cardGap = 32; // 2rem
                    const cardStep = cardWidth + cardGap;
                    
                    const marqueeWidth = document.querySelector('.certs-marquee').offsetWidth;
                    const targetLeft = cardIndex * cardStep;
                    const targetOffset = targetLeft - (marqueeWidth / 2) + (cardWidth / 2);
                    
                    // Smooth scroll to card
                    track.style.transition = 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
                    track.style.transform = `translate3d(-${targetOffset}px, 0, 0)`;

                    // Trigger highlight glow flash on card
                    cards.forEach(c => c.classList.remove('reference-flash'));
                    targetCard.classList.add('reference-flash');

                    // Auto-resume marquee after a timeout
                    clearTimeout(resumeTimeout);
                    resumeTimeout = setTimeout(() => {
                        track.style.animation = '';
                        track.style.transition = '';
                        track.style.transform = '';
                        track.classList.remove('manual-paused');
                        targetCard.classList.remove('reference-flash');
                        node.classList.remove('active');
                    }, 6000);
                }
            });
        });

        // 7. Dynamic Scroll Highlighting
        function updateTimelineHighlights() {
            if (!track || !timelineNodesContainer) return;
            
            const style = window.getComputedStyle(track);
            const matrix = style.transform || style.webkitTransform;
            
            let trackX = 0;
            if (matrix && matrix !== 'none') {
                const parts = matrix.split(',');
                if (parts.length >= 6) {
                    trackX = Math.abs(parseFloat(parts[4]));
                }
            }
            
            const marquee = document.querySelector('.certs-marquee');
            if (!marquee) return;
            const marqueeWidth = marquee.offsetWidth;
            
            const firstCard = cards[0];
            if (!firstCard) return;
            const cardWidth = firstCard.offsetWidth;
            
            const styleGap = window.getComputedStyle(track).gap;
            const gap = parseFloat(styleGap) || 32;
            const step = cardWidth + gap;
            
            const visibleIds = new Set();
            
            cards.forEach((card, index) => {
                const cardId = parseInt(card.getAttribute('data-id'));
                
                const leftInViewport = (index * step) - trackX;
                const rightInViewport = leftInViewport + cardWidth;
                
                // Card is visible if a significant portion of it is inside the viewport
                const threshold = cardWidth * 0.15;
                if (rightInViewport >= threshold && leftInViewport <= marqueeWidth - threshold) {
                    visibleIds.add(cardId);
                }
            });
            
            const timelineNodes = document.querySelectorAll('.certs-timeline-node');
            timelineNodes.forEach(node => {
                const nodeId = parseInt(node.getAttribute('data-id'));
                if (visibleIds.has(nodeId)) {
                    node.classList.add('visible-in-marquee');
                } else {
                    node.classList.remove('visible-in-marquee');
                }
            });
            
            requestAnimationFrame(updateTimelineHighlights);
        }
        
        requestAnimationFrame(updateTimelineHighlights);
    }

    function openCertificateModal(imageSrc, title) {
        // Create modal element if it doesn't exist
        let modal = document.querySelector('.cert-lightbox');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'cert-lightbox';
            modal.innerHTML = `
                <div class="cert-lightbox-backdrop"></div>
                <div class="cert-lightbox-content">
                    <button class="cert-lightbox-close" aria-label="Close lightbox">&times;</button>
                    <img class="cert-lightbox-img" src="" alt="" />
                    <div class="cert-lightbox-caption"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close listeners
            modal.querySelector('.cert-lightbox-backdrop').addEventListener('click', closeCertificateModal);
            modal.querySelector('.cert-lightbox-close').addEventListener('click', closeCertificateModal);
            
            // Close on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closeCertificateModal();
            });
        }

        const img = modal.querySelector('.cert-lightbox-img');
        const caption = modal.querySelector('.cert-lightbox-caption');
        img.src = imageSrc;
        img.alt = title;
        caption.textContent = title;

        // Show modal
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent page scroll
    }

    function closeCertificateModal() {
        const modal = document.querySelector('.cert-lightbox');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = ''; // Restore scroll
        }
    }

    function boot() {
        initLoader();
        initScrollProgress();
        initChatWidget();
        initCursor();
        initHamburger();
        initCertificates();
        checkPendingReference();
    }
})();
