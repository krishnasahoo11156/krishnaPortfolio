/* ================================================================
   TIMELINE — JS Controller
   ================================================================ */

(function () {
    'use strict';

    /* ---- 1. Draw the center line on scroll ---- */
    function initTimelineLine() {
        var line = document.querySelector('.timeline-line');
        var wrap = document.querySelector('.timeline-wrap');
        if (!line || !wrap) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    line.classList.add('drawn');
                    observer.disconnect();
                }
            });
        }, { threshold: 0.08 });

        observer.observe(wrap);
    }

    /* ---- 2. Slide-in cards on scroll ---- */
    function initCardReveal() {
        var items = document.querySelectorAll('.tl-item');
        if (!items.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.15 });

        items.forEach(function (el) { observer.observe(el); });
    }

    /* ---- 3. Achievements accordion ---- */
    function initAchievementsToggle() {
        var btn = document.getElementById('achievements-toggle');
        var subWrap = document.getElementById('achievements-sub');
        if (!btn || !subWrap) return;

        btn.addEventListener('click', function () {
            var isOpen = subWrap.classList.toggle('open');
            btn.classList.toggle('open', isOpen);

            if (isOpen) {
                // Stagger sub-items
                var subItems = subWrap.querySelectorAll('.tl-sub-item');
                subItems.forEach(function (item, i) {
                    setTimeout(function () {
                        item.classList.add('visible');
                    }, i * 80);
                });
            } else {
                var subItems = subWrap.querySelectorAll('.tl-sub-item');
                subItems.forEach(function (item) {
                    item.classList.remove('visible');
                });
            }
        });
    }

    /* ---- 4. Counter animation ---- */
    function animateCounter(el) {
        var target = parseInt(el.dataset.target, 10);
        var suffix = el.dataset.suffix || '';
        var duration = 1800;
        var start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            var current = Math.round(ease * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    function initCounters() {
        var counters = document.querySelectorAll('.tl-cnt-num[data-target]');
        if (!counters.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) { observer.observe(el); });
    }

    /* ---- Boot ---- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    function boot() {
        initTimelineLine();
        initCardReveal();
        initAchievementsToggle();
        initCounters();
    }
})();
