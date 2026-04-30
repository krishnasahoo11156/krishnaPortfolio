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
  ];

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
    });
  });

  /* ── SCROLL REVEAL (staggered) ────────────────────────────── */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('glitch-enter');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.proj-card').forEach(c => obs.observe(c));

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
  }

  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* Wire card clicks */
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('a') || e.target.closest('.proj-btn')) return;
      openModal(card.dataset.id);
    });
  });

})();
