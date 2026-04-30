/* ================================================================
   HERO ENGINE — Glitch on Load + Mouse Parallax + Typing
   ================================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       CONSTANTS
    ---------------------------------------------------------- */
    const GLITCH_DURATION   = 1500;  // ms — how long the load glitch runs
    const SCRAMBLE_CHARS    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&!?/\\|><[]{}';
    const TYPING_STRINGS    = ['Software Developer', 'Problem Solver', 'Open Source Contributor'];
    const TYPING_SPEED      = 80;   // ms per char
    const ERASING_SPEED     = 40;
    const PAUSE_AFTER_TYPE  = 2000;
    const PAUSE_AFTER_ERASE = 400;
    const IS_MOBILE         = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    /* ----------------------------------------------------------
       DOM refs — populated in init()
    ---------------------------------------------------------- */
    let hero, imgBg, imgR, imgG, imgB, glitchWrap;
    let heroName, heroTypingEl;
    let textLayer, midLayer, bgLayer;

    /* ----------------------------------------------------------
       UTILITY: random int between min and max
    ---------------------------------------------------------- */
    const rInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const rFloat = (min, max) => Math.random() * (max - min) + min;

    /* ----------------------------------------------------------
       1. IMAGE GLITCH ON LOAD
          Randomly offset the R/G/B channel clones and flicker clip-path
    ---------------------------------------------------------- */
    function startImageGlitch () {
        if (!glitchWrap) return;
        glitchWrap.classList.add('glitch-active');

        const startTime = performance.now();
        let rafId;

        function frame (now) {
            const elapsed = now - startTime;
            if (elapsed >= GLITCH_DURATION) {
                // Settle cleanly
                glitchWrap.classList.remove('glitch-active');
                if (imgR) { imgR.style.transform = ''; imgR.style.clipPath = ''; }
                if (imgG) { imgG.style.transform = ''; imgG.style.clipPath = ''; }
                if (imgB) { imgB.style.transform = ''; imgB.style.clipPath = ''; }
                return;
            }

            // Intensity decays over time → glitch settles
            const progress  = elapsed / GLITCH_DURATION;
            const intensity = Math.pow(1 - progress, 0.6); // fast → slow decay
            const maxOffset = 18 * intensity;
            const maxSlice  = 80 * intensity;

            // Every ~40 ms we scramble offsets
            if (imgR && imgG && imgB) {
                const rx = rFloat(-maxOffset, maxOffset);
                const ry = rFloat(-maxOffset * 0.3, maxOffset * 0.3);
                const gx = rFloat(-maxOffset, maxOffset) * -0.5;
                const gy = rFloat(-maxOffset * 0.2, maxOffset * 0.2);
                const bx = rFloat(-maxOffset * 0.8, maxOffset * 0.8);
                const by = rFloat(-maxOffset * 0.2, maxOffset * 0.2);

                imgR.style.transform = `translate(${rx}px, ${ry}px)`;
                imgG.style.transform = `translate(${gx}px, ${gy}px)`;
                imgB.style.transform = `translate(${bx}px, ${by}px)`;

                // Random horizontal slice clip-paths
                const sliceY1 = rFloat(0, 100 - maxSlice);
                const sliceH  = rFloat(4, maxSlice);
                const sliceY2 = rFloat(0, 100 - maxSlice);
                const sliceH2 = rFloat(4, maxSlice * 0.5);

                imgR.style.clipPath = `polygon(0 ${sliceY1}%, 100% ${sliceY1}%, 100% ${sliceY1 + sliceH}%, 0 ${sliceY1 + sliceH}%)`;
                imgB.style.clipPath = `polygon(0 ${sliceY2}%, 100% ${sliceY2}%, 100% ${sliceY2 + sliceH2}%, 0 ${sliceY2 + sliceH2}%)`;
            }

            // Flicker base image opacity
            if (imgBg) {
                imgBg.style.opacity = (Math.random() > 0.15) ? '1' : String(rFloat(0.4, 0.85));
            }

            rafId = requestAnimationFrame(frame);
        }

        rafId = requestAnimationFrame(frame);

        // Safety cleanup
        setTimeout(() => {
            cancelAnimationFrame(rafId);
            glitchWrap.classList.remove('glitch-active');
        }, GLITCH_DURATION + 100);
    }

    /* ----------------------------------------------------------
       2. TEXT SCRAMBLE — "KRISHNA SAHOO" letter by letter
    ---------------------------------------------------------- */
    function scrambleText (element, finalText, onComplete) {
        if (!element) return;

        const letters   = finalText.split('');
        const total     = letters.length;
        let   revealed  = 0;
        let   frame     = 0;

        // Build spans for each char
        element.innerHTML = letters.map((ch, i) =>
            ch === ' '
                ? '<span class="char" style="display:inline-block;width:0.4em;"> </span>'
                : `<span class="char" data-final="${ch}" style="display:inline-block;">${SCRAMBLE_CHARS[rInt(0, SCRAMBLE_CHARS.length - 1)]}</span>`
        ).join('');

        const spans = element.querySelectorAll('.char[data-final]');
        const scrambleDuration = GLITCH_DURATION;
        const revealInterval = scrambleDuration / total;

        // Periodically lock in one letter
        const revealTimer = setInterval(() => {
            if (revealed >= total) {
                clearInterval(revealTimer);
                clearInterval(flickerTimer);
                // Final lock
                spans.forEach(s => { s.textContent = s.dataset.final; });
                if (onComplete) onComplete();
                return;
            }
            const span = spans[revealed];
            if (span) {
                span.textContent = span.dataset.final;
                span.classList.add('locked');
            }
            revealed++;
        }, revealInterval);

        // Meanwhile flicker all un-locked chars
        const flickerTimer = setInterval(() => {
            spans.forEach((span, i) => {
                if (i >= revealed) {
                    span.textContent = SCRAMBLE_CHARS[rInt(0, SCRAMBLE_CHARS.length - 1)];
                }
            });
        }, 50);
    }

    /* ----------------------------------------------------------
       3. MINI GLITCH BURST — triggered on name hover
    ---------------------------------------------------------- */
    function triggerGlitchBurst (element) {
        if (!element || element.classList.contains('glitch-burst')) return;
        element.classList.add('glitch-burst');
        setTimeout(() => element.classList.remove('glitch-burst'), 350);
    }

    /* ----------------------------------------------------------
       4. TYPING ANIMATION — subtitle cycling
    ---------------------------------------------------------- */
    function startTyping () {
        if (!heroTypingEl) return;

        let strIndex  = 0;
        let charIndex = 0;
        let isErasing = false;

        function tick () {
            const currentStr = TYPING_STRINGS[strIndex];

            if (!isErasing) {
                heroTypingEl.textContent = currentStr.slice(0, charIndex + 1);
                charIndex++;
                if (charIndex >= currentStr.length) {
                    isErasing = true;
                    setTimeout(tick, PAUSE_AFTER_TYPE);
                    return;
                }
                setTimeout(tick, TYPING_SPEED);
            } else {
                heroTypingEl.textContent = currentStr.slice(0, charIndex - 1);
                charIndex--;
                if (charIndex <= 0) {
                    isErasing = false;
                    strIndex  = (strIndex + 1) % TYPING_STRINGS.length;
                    setTimeout(tick, PAUSE_AFTER_ERASE);
                    return;
                }
                setTimeout(tick, ERASING_SPEED);
            }
        }

        // Start after glitch settles
        setTimeout(tick, GLITCH_DURATION + 200);
    }

    /* ----------------------------------------------------------
       5. MOUSE PARALLAX
          Layer speeds: bg=2%, mid=5%, fg=8%
    ---------------------------------------------------------- */
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let parallaxRaf;

    function lerp (a, b, t) { return a + (b - a) * t; }

    function animateParallax () {
        currentX = lerp(currentX, targetX, 0.06);
        currentY = lerp(currentY, targetY, 0.06);

        if (bgLayer)  bgLayer.style.transform  = `translate(${currentX * 0.02}px, ${currentY * 0.02}px) scale(1.08)`;
        if (midLayer) midLayer.style.transform  = `translate(${currentX * 0.05}px, ${currentY * 0.05}px)`;
        if (textLayer) textLayer.style.transform = `translate(${currentX * 0.08}px, ${currentY * 0.08}px)`;

        parallaxRaf = requestAnimationFrame(animateParallax);
    }

    function onMouseMove (e) {
        // Offset from center of window, normalised to px
        targetX = e.clientX - window.innerWidth  / 2;
        targetY = e.clientY - window.innerHeight / 2;
    }

    /* ----------------------------------------------------------
       6. GYROSCOPE (mobile)
    ---------------------------------------------------------- */
    function onDeviceOrientation (e) {
        // gamma = left/right tilt (-90 to 90), beta = front/back (-180 to 180)
        const gamma = Math.max(-30, Math.min(30, e.gamma || 0));
        const beta  = Math.max(-30, Math.min(30, (e.beta || 0) - 30));
        targetX = gamma * 8;   // scale to reasonable px range
        targetY = beta  * 8;
    }

    /* ----------------------------------------------------------
       7. BUTTON GLITCH HOVER
    ---------------------------------------------------------- */
    function attachButtonGlitch (btn) {
        if (!btn) return;
        btn.addEventListener('mouseenter', () => {
            btn.classList.add('btn-glitch');
            setTimeout(() => btn.classList.remove('btn-glitch'), 350);
        });
    }

    /* ----------------------------------------------------------
       INIT
    ---------------------------------------------------------- */
    function init () {
        hero        = document.getElementById('home');
        glitchWrap  = document.getElementById('hero-glitch-wrap');
        imgBg       = document.getElementById('hero-img-bg');
        imgR        = document.getElementById('hero-img-r');
        imgG        = document.getElementById('hero-img-g');
        imgB        = document.getElementById('hero-img-b');
        bgLayer     = document.getElementById('hero-layer-bg');
        midLayer    = document.getElementById('hero-layer-mid');
        textLayer   = document.getElementById('hero-layer-fg');
        heroName    = document.getElementById('hero-name');
        heroTypingEl = document.getElementById('hero-typing');

        if (!hero) return;

        // ---- Glitch on load ----
        startImageGlitch();

        // Scramble name text — keep KRISHNA / SAHOO splits
        const krishna = document.getElementById('hero-name-krishna');
        const sahoo   = document.getElementById('hero-name-sahoo');
        if (krishna) scrambleText(krishna, 'KRISHNA');
        if (sahoo)   scrambleText(sahoo,   'SAHOO');

        // ---- Typing animation ----
        startTyping();

        // ---- Parallax ----
        if (!IS_MOBILE) {
            hero.addEventListener('mousemove', onMouseMove, { passive: true });
            parallaxRaf = requestAnimationFrame(animateParallax);
        } else {
            // Request gyroscope permission on iOS 13+
            if (typeof DeviceOrientationEvent !== 'undefined' &&
                typeof DeviceOrientationEvent.requestPermission === 'function') {
                document.body.addEventListener('click', function askPerm () {
                    DeviceOrientationEvent.requestPermission()
                        .then(state => {
                            if (state === 'granted') {
                                window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
                                parallaxRaf = requestAnimationFrame(animateParallax);
                            }
                        });
                    document.body.removeEventListener('click', askPerm);
                }, { once: true });
            } else {
                window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
                parallaxRaf = requestAnimationFrame(animateParallax);
            }
        }

        // ---- Name hover glitch ----
        if (heroName) {
            heroName.addEventListener('mouseenter', () => triggerGlitchBurst(heroName));
        }

        // ---- Button glitch hover ----
        document.querySelectorAll('.hero-buttons .btn').forEach(attachButtonGlitch);

        // Stop parallax when hero leaves viewport
        const stopObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    cancelAnimationFrame(parallaxRaf);
                } else {
                    parallaxRaf = requestAnimationFrame(animateParallax);
                }
            });
        });
        stopObserver.observe(hero);
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
