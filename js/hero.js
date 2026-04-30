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


    /* ----------------------------------------------------------
       DOM refs — populated in init()
    ---------------------------------------------------------- */
    let heroTypingEl;

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
       INIT
    ---------------------------------------------------------- */
    function init () {
        heroTypingEl = document.getElementById('hero-typing');

        // ---- Typing animation ----
        startTyping();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
