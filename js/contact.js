/* ================================================================
   CONTACT — JS Controller
   Handles: reveal animations, social link stagger,
            Formspree submission, success/error states
   ================================================================ */

(function () {
    'use strict';

    /* ---- 1. Intersection-based reveal ---- */
    function initReveal() {
        var left  = document.querySelector('.contact-left');
        var right = document.querySelector('.contact-right');

        if (!left && !right) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        if (left)  observer.observe(left);
        if (right) observer.observe(right);
    }

    /* ---- 2. Social links staggered reveal ---- */
    function initSocialStagger() {
        var links = document.querySelectorAll('.cs-link');
        if (!links.length) return;

        var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                links.forEach(function (link, i) {
                    setTimeout(function () {
                        link.classList.add('revealed');
                    }, 80 + i * 90);
                });
                observer.disconnect();
            }
        }, { threshold: 0.2 });

        observer.observe(links[0].closest('.contact-socials') || links[0]);
    }

    /* ---- 3. Formspree form submission ---- */
    function initForm() {
        var form    = document.getElementById('contact-form');
        var card    = document.getElementById('contact-card-body');
        var success = document.getElementById('contact-success');
        var errMsg  = document.getElementById('cf-error-msg');
        var btn     = document.getElementById('cf-submit-btn');

        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Clear previous error
            if (errMsg) {
                errMsg.classList.remove('visible');
            }

            // Disable button
            btn.disabled = true;
            btn.textContent = 'SENDING...';

            var data = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            })
            .then(function (response) {
                if (response.ok) {
                    // Show success state
                    if (card)    card.style.display = 'none';
                    if (success) success.classList.add('visible');
                } else {
                    return response.json().then(function (json) {
                        throw new Error(json.error || 'Server error');
                    });
                }
            })
            .catch(function () {
                // Re-enable button and show error
                btn.disabled = false;
                btn.textContent = 'SUBMIT INQUIRY →';
                if (errMsg) errMsg.classList.add('visible');
            });
        });
    }

    /* ---- Boot ---- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    function boot() {
        initReveal();
        initSocialStagger();
        initForm();
    }
})();
