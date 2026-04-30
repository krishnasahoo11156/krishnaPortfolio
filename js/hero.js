/* ================================================================
   HERO ENGINE — Mouse Parallax + Typing
   ================================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       CONSTANTS
    ---------------------------------------------------------- */
    const TYPING_STRINGS    = ['Software Developer', 'Problem Solver', 'Open Source Contributor'];
    const TYPING_SPEED      = 80;   // ms per char
    const ERASING_SPEED     = 40;
    const PAUSE_AFTER_TYPE  = 2000;
    const PAUSE_AFTER_ERASE = 400;
    const IS_MOBILE         = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    /* ----------------------------------------------------------
       DOM refs — populated in init()
    ---------------------------------------------------------- */
    let hero;
    let heroTypingEl;
    let textLayer, midLayer, bgLayer;

    /* ----------------------------------------------------------
       1. TYPING ANIMATION — subtitle cycling
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

        // Start typing immediately
        setTimeout(tick, 200);
    }

    /* ----------------------------------------------------------
       2. MOUSE PARALLAX
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
       3. GYROSCOPE (mobile)
    ---------------------------------------------------------- */
    function onDeviceOrientation (e) {
        // gamma = left/right tilt (-90 to 90), beta = front/back (-180 to 180)
        const gamma = Math.max(-30, Math.min(30, e.gamma || 0));
        const beta  = Math.max(-30, Math.min(30, (e.beta || 0) - 30));
        targetX = gamma * 8;   // scale to reasonable px range
        targetY = beta  * 8;
    }

    /* ----------------------------------------------------------
       INIT
    ---------------------------------------------------------- */
    function init () {
        hero        = document.getElementById('home');
        bgLayer     = document.getElementById('hero-layer-bg');
        midLayer    = document.getElementById('hero-layer-mid');
        textLayer   = document.getElementById('hero-layer-fg');
        heroTypingEl = document.getElementById('hero-typing');

        if (!hero) return;

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
