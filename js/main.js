document.addEventListener('DOMContentLoaded', () => {

    /* =============================================
       SMOOTH SCROLLING
       ============================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = 80; // navbar height offset
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    /* =============================================
       NAVBAR: shrink + active link on scroll
       ============================================= */
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    const updateNavbar = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', () => {
        updateNavbar();
        updateActiveLink();
    }, { passive: true });

    updateNavbar();
    updateActiveLink();


    /* =============================================
       SCROLL REVEAL — staggered children
       ============================================= */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || 0;
                setTimeout(() => {
                    el.classList.add('active');
                }, delay);
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* =============================================
       PROGRESS BARS — animate width on scroll
       ============================================= */
    const progressFills = document.querySelectorAll('.progress-fill');

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const target = fill.dataset.width || fill.style.getPropertyValue('--target-width') || '0%';
                // Small delay so the section reveal fires first
                setTimeout(() => {
                    fill.style.width = target;
                }, 300);
                progressObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.2 });

    progressFills.forEach(fill => {
        // Move the inline width to a data attribute so we can animate it
        const targetWidth = fill.style.width;
        fill.dataset.width = targetWidth;
        fill.style.width = '0';
        progressObserver.observe(fill);
    });


    /* =============================================
       CARD STAGGER — add sequential delay
       ============================================= */
    document.querySelectorAll('.grid-3 .card, .grid-2 .card').forEach((card, i) => {
        if (!card.classList.contains('reveal')) {
            card.classList.add('reveal');
            card.dataset.delay = i * 120;
            revealObserver.observe(card);
        }
    });


    /* =============================================
       ANIMATED COUNTERS — count up on scroll
       ============================================= */
    const counters = document.querySelectorAll('.cnt-num[data-target]');

    const animateCounter = (el) => {
        const target  = parseInt(el.dataset.target, 10);
        const suffix  = el.dataset.suffix || '';
        const duration = 1600; // ms
        const start   = performance.now();

        const tick = (now) => {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased    = 1 - Math.pow(1 - progress, 3);
            const current  = Math.floor(eased * target);
            el.textContent = current + (progress >= 1 ? suffix : '');
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(c => counterObserver.observe(c));

});
