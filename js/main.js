function bootMain() {

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
    const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile-overlay a');
    const sections = document.querySelectorAll('section[id]');

    const updateNavbar = () => {
        if (!navbar) return;
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    const updateActiveLink = () => {
        if (!navLinks || navLinks.length === 0 || sections.length === 0) return;
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            const onclickStr = link.getAttribute('onclick') || '';
            if (href === `#${current}` || (current === 'timeline' && onclickStr.includes('timeline.html'))) {
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
    const progressFills = document.querySelectorAll('.progress-fill, .sk-progress-fill');

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                // Support both old and new bar logic
                const target = fill.dataset.width || 
                               fill.style.getPropertyValue('--target-width') || 
                               fill.style.getPropertyValue('--bar-width') || 
                               '0%';
                
                // Small delay so the section reveal fires first
                setTimeout(() => {
                    fill.style.width = target;
                }, 300);
                progressObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.1 });

    progressFills.forEach(fill => {
        // Prepare bars for animation by setting width to 0
        const targetWidth = fill.style.getPropertyValue('--bar-width') || fill.style.width;
        if (targetWidth) fill.dataset.width = targetWidth;
        
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

    /* =============================================
       THEME TOGGLE
       ============================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const heroImg = document.querySelector('.hero-img');
    
    const updateHeroImage = (theme) => {
        if (!heroImg) return;
        if (theme === 'light') {
            heroImg.src = 'lightmode.png';
        } else {
            heroImg.src = 'image.png';
        }
    };

    if (themeToggleBtn) {
        const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        updateHeroImage(initialTheme);

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateHeroImage(newTheme);
            
            window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: newTheme } }));
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootMain);
} else {
    bootMain();
}
