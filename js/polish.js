/* ================================================================
   POLISH.JS — Scroll progress, back-to-top, custom cursor,
               hamburger menu, page load sequence
   ================================================================ */
(function () {
    'use strict';

    /* ── 1. PAGE LOAD SEQUENCE ── */
    function initLoader() {
        var loader = document.getElementById('page-loader');
        var navbar = document.querySelector('.navbar');
        if (!loader) return;

        // After brief glitch (300ms) → fade out loader → reveal navbar
        setTimeout(function () {
            loader.classList.add('hidden');
            if (navbar) navbar.classList.add('nav-visible');

            // Remove from DOM after transition ends
            setTimeout(function () {
                if (loader.parentNode) loader.parentNode.removeChild(loader);
            }, 600);
        }, 350);
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

    /* ── 3. BACK TO TOP ── */
    function initBackToTop() {
        var btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

    /* ── 6. PROJ CARD STAGGER (supplement main.js) ── */
    function initProjStagger() {
        var cards = document.querySelectorAll('.proj-card');
        if (!cards.length) return;

        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el    = entry.target;
                    var delay = parseInt(el.dataset.delay || 0, 10);
                    setTimeout(function () {
                        el.style.opacity   = '1';
                        el.style.transform = 'translateY(0)';
                    }, delay);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        cards.forEach(function (card) {
            card.style.opacity   = '0';
            card.style.transform = 'translateY(28px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
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
        initBackToTop();
        initCursor();
        initHamburger();
        initProjStagger();
    }
})();
