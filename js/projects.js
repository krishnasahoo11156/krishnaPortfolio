/* projects.js — filter tabs, modal, scroll reveal */
(function () {
  'use strict';

  /* ── PROJECT DATA ─────────────────────────────────────────── */
  const PROJECTS = [
    {
      id: 'crisissync',
      filter: 'full-stack',
      title: 'CrisisSync',
      oneliner: 'AI-powered real-time crisis response and emergency coordination platform.',
      desc: 'CrisisSync is a production-grade emergency coordination system that combines Gemini AI incident classification with live Google Maps tracking, role-based access portals (Guest, Staff, Admin), and a real-time ADI dashboard. Built end-to-end with Flutter, Firebase, and deployed on Google Cloud Run via Docker.',
      status: 'live',
      category: 'FULL STACK · AI SYSTEM',
      tags: ['Flutter', 'Firebase', 'Gemini AI', 'Docker', 'Cloud Run', 'Maps API'],
      timeline: 'May 2026 · Completed',
      timelinePct: 100,
      thumb: 'crisissync.png',
      thumbIcon: '🚨',
      highlights: [
        'AI incident classification with severity scoring',
        'Role-based portals: Guest, Staff, Admin',
        'Live ADI dashboard + Google Maps tracking',
      ],
      features: [
        'AI incident classification with automatic severity scoring via Gemini',
        'Three distinct role-based portals: Guest SOS, Staff coordination, Admin control',
        'Real-time ADI (Active Disaster Index) dashboard with live metrics',
        'Google Maps integration showing incident heatmaps and responder locations',
        'Docker containerised and deployed on Google Cloud Run',
        'Firebase Authentication with role-gated route protection',
      ],
      tech: [
        { label: 'Flutter', badge: 'FL' },
        { label: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
        { label: 'Dart', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
        { label: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        { label: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      ],
      demo: 'https://crisissync-web-5ah5sevnmq-el.a.run.app',
      github: 'https://github.com/krishnasahoo11156/crisissync',
    },
    {
      id: 'studysync',
      filter: 'in-progress',
      title: 'StudySync',
      oneliner: 'All-in-one academic productivity platform with smart scheduling and focus tools.',
      desc: 'StudySync is a React-based academic companion designed to eliminate the friction of student productivity. It features an intelligent calendar with conflict detection, a Pomodoro timer with ambient sound generation, and a cloud file library — all synced in real time via Firebase.',
      status: 'progress',
      category: 'FRONTEND · FULL STACK',
      tags: ['React.js', 'Vite', 'Tailwind CSS', 'Firebase', 'Web Audio API'],
      timeline: 'April 2026 · In Progress',
      timelinePct: 60,
      thumb: 'studysync.png',
      thumbIcon: '📚',
      highlights: [
        'Intelligent calendar with conflict detection',
        'Pomodoro timer with ambient sound generation',
        'Cloud file library with folder system',
      ],
      features: [
        'Intelligent academic calendar that detects and resolves scheduling conflicts',
        'Pomodoro timer with Web Audio API ambient soundscapes (rain, lo-fi, white noise)',
        'Cloud file library with nested folder support, synced via Firebase Storage',
        'Task manager with priority tagging and deadline reminders',
        'Progress analytics dashboard showing study trends over time',
        'Offline-first architecture with service worker caching',
      ],
      tech: [
        { label: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { label: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
        { label: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg' },
        { label: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      ],
      demo: 'https://study-sync-eosin-seven.vercel.app/',
      github: 'https://github.com/krishnasahoo11156/StudySync',
    },
    {
      id: 'onboarding',
      filter: 'hackathon',
      title: 'Autonomous Developer Onboarding Agent',
      oneliner: 'AI-powered platform that automates developer setup and guidance from day one.',
      desc: 'Built at Syrus 2026 Hackathon, this Next.js platform uses Gemini AI to guide new developers through onboarding — automatically verifying their local environment, generating role-specific learning paths, and surfacing real-time HR analytics. Won recognition for autonomous agent architecture.',
      status: 'hackathon',
      category: 'AI SYSTEM · NEXT.JS',
      tags: ['Next.js', 'TypeScript', 'Gemini AI', 'NextAuth', 'Framer Motion', 'Chart.js'],
      timeline: 'March 2026 · Syrus 2026 Hackathon',
      timelinePct: 100,
      thumb: 'onboarding.png',
      thumbIcon: '⚡',
      highlights: [
        'Gemini AI assistant for onboarding guidance',
        'Local environment agent verifies dev tools',
        'HR dashboard with real-time analytics',
      ],
      features: [
        'Gemini AI conversational assistant guiding developers step-by-step through onboarding',
        'Local environment verification agent checks Node, Git, Docker versions automatically',
        'Role-based learning paths generated dynamically based on tech stack and seniority',
        'HR dashboard with Chart.js visualisations of onboarding completion rates',
        'NextAuth authentication with Google and GitHub OAuth providers',
        'Framer Motion animated onboarding flow with progress persistence',
      ],
      tech: [
        { label: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
        { label: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
        { label: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      ],
      demo: null,
      github: 'https://github.com/CMPN-CODECELL/Syrus2026_AlgoMinds',
    },
    {
      id: 'code2git',
      filter: 'full-stack',
      title: 'Code2Git',
      oneliner: 'Chrome extension that automatically syncs solved DSA questions from LeetCode, GFG, HackerRank, and Codeforces to GitHub.',
      desc: 'Code2Git is a developer utility Chrome extension that automates the process of maintaining a DSA solutions repository. It monitors submissions on LeetCode, GeeksforGeeks, HackerRank, and Codeforces, extracts the problem statement, code, difficulty, and runtime, and automatically commits and pushes them to a specified GitHub repository via the GitHub REST API with full OAuth authentication.',
      status: 'live',
      category: 'CHROME EXTENSION · AUTOMATION',
      tags: ['Chrome Extension', 'JavaScript', 'GitHub API', 'OAuth 2.0', 'DOM Parsing'],
      timeline: 'June 2026 · Completed',
      timelinePct: 100,
      thumb: 'c2g.png',
      thumbIcon: '🔌',
      highlights: [
        'Automated solution extraction & parsing',
        'Supports LeetCode, GFG, HackerRank & Codeforces',
        'Direct GitHub API integration with secure OAuth',
      ],
      features: [
        'Secure GitHub OAuth authentication to authorize repository access',
        'Real-time DOM scraping and parsing of successful code submissions',
        'Automatic folder structure creation (Platform/Difficulty/ProblemName)',
        'Detailed commit messages containing time complexity, space complexity, and runtime',
        'Offline queue to retry commits if network connectivity is lost',
        'Customizable readme generation for each synced problem',
      ],
      tech: [
        { label: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { label: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { label: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
        { label: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      ],
      demo: null,
      github: 'https://github.com/krishnasahoo11156/Code2Git',
    },
  ];

  /* ── 3D CAROUSEL STATE & LOGIC ───────────────────────────── */
  let activeCards = [];
  let currentIndex = 0;
  let rotationInterval = null;
  let hoveredCard = null;
  const ROTATION_DELAY = 2500;

  function updateCarouselLayout() {
    const len = activeCards.length;

    // Reset all cards to hidden by default
    document.querySelectorAll('.proj-card').forEach(card => {
      card.classList.remove('pos-left', 'pos-center', 'pos-right', 'pos-hidden');
      card.classList.add('pos-hidden');
    });

    if (len === 0) return;

    activeCards.forEach((card, idx) => {
      card.classList.remove('pos-hidden');

      // Circular difference math
      let diff = (idx - currentIndex) % len;
      if (diff < 0) diff += len;

      if (diff === 0) {
        card.classList.add('pos-center');
      } else if (diff === 1 && len > 1) {
        card.classList.add('pos-right');
      } else if (diff === len - 1 && len > 2) {
        card.classList.add('pos-left');
      } else {
        card.classList.add('pos-hidden');
      }
    });

    // Check if the currently hovered card has become the center card
    if (hoveredCard && hoveredCard.classList.contains('pos-center')) {
      stopAutoRotation();
    } else {
      startAutoRotation();
    }

    // Update dots and arrow visibility
    updateCarouselControls();
  }

  const dotsContainer = document.getElementById('proj-carousel-dots');
  const prevBtn = document.getElementById('proj-arrow-prev');
  const nextBtn = document.getElementById('proj-arrow-next');

  function updateCarouselControls() {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    const len = activeCards.length;

    // Show/hide controls based on active count
    const controls = document.querySelector('.proj-carousel-controls');
    if (controls) {
      controls.style.display = len <= 1 ? 'none' : 'flex';
    }

    if (len <= 1) return;

    for (let i = 0; i < len; i++) {
      const dot = document.createElement('button');
      dot.className = 'proj-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
      dot.setAttribute('aria-label', `Go to project ${i + 1}`);

      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarouselLayout();
        stopAutoRotation();
        startAutoRotation();
      });

      dotsContainer.appendChild(dot);
    }
  }

  function startAutoRotation() {
    if (rotationInterval) clearInterval(rotationInterval);
    if (activeCards.length <= 1) return;

    // Safety check: if hovering center card, do not start rotation
    if (hoveredCard && hoveredCard.classList.contains('pos-center')) return;

    rotationInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % activeCards.length;
      updateCarouselLayout();
    }, ROTATION_DELAY);
  }

  function stopAutoRotation() {
    if (rotationInterval) {
      clearInterval(rotationInterval);
      rotationInterval = null;
    }
  }

  /* ── FILTER TABS ──────────────────────────────────────────── */
  document.querySelectorAll('.proj-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.proj-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;

      document.querySelectorAll('.proj-card').forEach(card => {
        if (f === 'all' || card.dataset.filter === f) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      // Update active cards for carousel
      activeCards = Array.from(document.querySelectorAll('.proj-card')).filter(card => !card.classList.contains('hidden'));
      currentIndex = 0;
      updateCarouselLayout();

      // Reset auto-rotation
      stopAutoRotation();
      startAutoRotation();
    });
  });

  /* ── MODAL ────────────────────────────────────────────────── */
  const backdrop = document.getElementById('proj-modal-backdrop');
  const modal    = backdrop.querySelector('.proj-modal');

  function statusBadgeHTML(p) {
    if (p.status === 'live')
      return `<span class="badge-live"><span class="badge-dot-g"></span>LIVE</span>`;
    if (p.status === 'progress')
      return `<span class="badge-progress"><span class="badge-dot-y"></span>IN PROGRESS</span>`;
    return `<span class="badge-hackathon">⚡ HACKATHON</span>`;
  }

  function openModal(id) {
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return;

    const techHTML = p.tech.map(t =>
      `<div class="modal-tech-item">
        ${t.badge
          ? `<div class="modal-tech-badge">${t.badge}</div>`
          : `<img src="${t.icon}" alt="${t.label}" loading="lazy">`
        }
        <span>${t.label}</span>
      </div>`
    ).join('');

    const featHTML = p.features.map((f, i) =>
      `<li><span class="feat-num">${String(i+1).padStart(2,'0')}.</span>${f}</li>`
    ).join('');

    const demoBtn = p.demo
      ? `<a href="${p.demo}" target="_blank" rel="noopener" class="proj-btn">LIVE DEMO →</a>`
      : `<span class="proj-btn-ghost">NO LIVE DEMO</span>`;

    modal.innerHTML = `
      <button class="modal-close" id="modal-close-btn" aria-label="Close">✕</button>
      <div class="modal-badges">
        ${statusBadgeHTML(p)}
        <span class="badge-cat">${p.category}</span>
      </div>
      <h2 class="modal-title">${p.title}</h2>
      <p class="modal-desc">${p.desc}</p>
      <div class="modal-section-title">KEY FEATURES</div>
      <ul class="modal-features">${featHTML}</ul>
      <div class="modal-section-title">TECH STACK</div>
      <div class="modal-tech-grid">${techHTML}</div>
      <div class="modal-section-title">TIMELINE</div>
      <div class="modal-timeline-bar">
        <div class="modal-timeline-fill" style="width:0" data-w="${p.timelinePct}"></div>
      </div>
      <div class="modal-timeline-label">${p.timeline}</div>
      <div class="modal-actions">
        ${demoBtn}
        <a href="${p.github}" target="_blank" rel="noopener" class="proj-btn">GITHUB ↗</a>
      </div>`;

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    stopAutoRotation();

    // animate timeline fill
    requestAnimationFrame(() => {
      const fill = modal.querySelector('.modal-timeline-fill');
      if (fill) { requestAnimationFrame(() => { fill.style.transition='width 0.8s ease'; fill.style.width = fill.dataset.w + '%'; }); }
    });

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';

    // Only resume auto-rotation if the user is NOT currently hovering the center card
    if (hoveredCard && hoveredCard.classList.contains('pos-center')) {
      stopAutoRotation();
    } else {
      startAutoRotation();
    }
  }

  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ── CAROUSEL SETUP & INTERACTIONS ────────────────────────── */

  // Wire card clicks
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('click', e => {
      // Ignore click on links and buttons inside the card
      if (e.target.closest('a') || e.target.closest('.proj-btn')) return;

      if (!card.classList.contains('pos-center')) {
        // Bring to center
        e.preventDefault();
        e.stopPropagation();
        const idx = activeCards.indexOf(card);
        if (idx !== -1) {
          currentIndex = idx;
          updateCarouselLayout();
          
          // Reset timer
          stopAutoRotation();
          startAutoRotation();
        }
      } else {
        // Center card click opens modal
        openModal(card.dataset.id);
      }
    });
  });

  // Initialize carousel values
  function initCarousel() {
    activeCards = Array.from(document.querySelectorAll('.proj-card')).filter(card => !card.classList.contains('hidden'));
    currentIndex = 0;
    updateCarouselLayout();

    // Setup precise card-level hover handlers
    document.querySelectorAll('.proj-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        hoveredCard = card;
        if (card.classList.contains('pos-center')) {
          stopAutoRotation();
        }
      });

      card.addEventListener('mouseleave', () => {
        if (hoveredCard === card) {
          hoveredCard = null;
        }
        startAutoRotation();
      });
    });

    // Wire arrow button click events
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const len = activeCards.length;
        if (len <= 1) return;
        currentIndex = (currentIndex - 1 + len) % len;
        updateCarouselLayout();
        stopAutoRotation();
        startAutoRotation();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const len = activeCards.length;
        if (len <= 1) return;
        currentIndex = (currentIndex + 1) % len;
        updateCarouselLayout();
        stopAutoRotation();
        startAutoRotation();
      });
    }

    // Start initial rotation if we aren't hovering the center card
    if (!(hoveredCard && hoveredCard.classList.contains('pos-center'))) {
      startAutoRotation();
    }
  }

  initCarousel();

})();
