/* ============================================================
   page-engine.js
   Requires: PAGE_KEY and PAGE_TITLE defined before this script
   Requires: KRISHNA_CONTENT from krishna-content.js
   ============================================================ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const data = KRISHNA_CONTENT[PAGE_KEY];

  /* Devicon CDN base */
  const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
  const iconMap = {
    'HTML5':             'html5/html5-original',
    'CSS3':              'css3/css3-original',
    'JavaScript ES6+':   'javascript/javascript-original',
    'React.js':          'react/react-original',
    'Responsive Design': null,
    'UI/UX Design':      'figma/figma-original',
    'Node.js':           'nodejs/nodejs-original',
    'Express.js':        'express/express-original',
    'Firebase':          'firebase/firebase-plain',
    'Git':               'git/git-original',
    'GitHub':            'github/github-original',
  };

  /* ── INIT ─────────────────────────────────────── */
  function bootEngine() {
    setHeroSubtitle();
    runTerminal();
    buildSkillCards();
    buildFlowchart();
    buildRealWorld();
    initThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootEngine);
  } else {
    bootEngine();
  }

  /* ── HERO SUBTITLE ────────────────────────────── */
  function setHeroSubtitle() {
    const el = document.getElementById('hero-subtitle');
    if (!el) return;
    const words = data.pageIntro.replace(/\s+/g, ' ').trim().split(' ');
    el.textContent = words.slice(0, 12).join(' ') + '…';
  }

  /* ── TERMINAL BOOT ────────────────────────────── */
  function runTerminal() {
    const terminal = document.getElementById('terminal');
    const body     = terminal.querySelector('.term-body');
    const intro    = document.getElementById('intro-text');

    const LINES = [
      { text: '> initialising krishna.dev...',                    delay: 200  },
      { text: `> loading skill module: ${PAGE_TITLE}...`,          delay: 500  },
      { text: '> parsing personal experience data...',             delay: 900  },
      { text: '> ready.',                                          delay: 1200 },
    ];

    LINES.forEach(({ text, delay }, idx) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'term-line';
        body.appendChild(line);

        if (reduced) {
          line.innerHTML = idx === LINES.length - 1
            ? `${text} <span class="term-cursor">█</span>`
            : text;
        } else {
          typewriteLine(line, text, idx === LINES.length - 1);
        }
      }, delay);
    });

    /* Fade terminal out after 1400ms, then reveal intro */
    setTimeout(() => {
      terminal.style.opacity  = '0';
      terminal.style.maxHeight = '0';
      terminal.style.overflow  = 'hidden';
      setTimeout(() => {
        terminal.style.display = 'none';
        intro.style.display    = 'block';
        revealIntro();
      }, 400);
    }, 1400);
  }

  function typewriteLine(el, text, withCursor) {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      el.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(iv);
        if (withCursor) el.innerHTML = text + ' <span class="term-cursor">█</span>';
      }
    }, 30);
  }

  /* ── INTRO WORD REVEAL ────────────────────────── */
  function revealIntro() {
    const el   = document.getElementById('intro-text');
    const text = data.pageIntro.replace(/\s+/g, ' ').trim();

    if (reduced) { el.textContent = text; return; }

    el.innerHTML = text
      .split(' ')
      .map(w => `<span class="word">${w}</span>`)
      .join(' ');

    el.querySelectorAll('.word').forEach((w, i) => {
      setTimeout(() => w.classList.add('vis'), i * 15);
    });
  }

  /* ── SKILL CARDS ──────────────────────────────── */
  function buildSkillCards() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    Object.entries(data.skills).forEach(([name, skill], i) => {
      const path = iconMap[name];
      const logo = path
        ? `<img src="${CDN}${path}.svg" alt="${name}" class="skill-logo">`
        : `<div class="skill-logo-fallback">${name[0]}</div>`;

      const card = document.createElement('div');
      card.className = 'detail-card';
      card.style.animationDelay = `${i * 120}ms`;
      card.innerHTML = `
        <div class="card-header">
          <div class="logo-wrap">${logo}</div>
          <span class="why-badge">${skill.tagline}</span>
        </div>
        <div class="skill-name">${name}</div>
        <div class="prof-bar-wrap">
          <div class="prof-bar-track">
            <div class="prof-bar-fill" data-w="${skill.proficiency}"></div>
          </div>
          <span class="prof-num">${skill.proficiency}%</span>
        </div>
        <p class="skill-blurb"></p>`;
      grid.appendChild(card);

      const fill  = card.querySelector('.prof-bar-fill');
      const blurb = card.querySelector('.skill-blurb');
      const blurbText = skill.blurb.replace(/\s+/g, ' ').trim();

      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        fill.style.width = fill.dataset.w + '%';
        if (reduced) { blurb.textContent = blurbText; }
        else          { typewriteBlurb(blurb, blurbText); }
        obs.disconnect();
      }, { threshold: 0.2 });
      obs.observe(card);
    });
  }

  function typewriteBlurb(el, text) {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      el.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(iv);
    }, 18);
  }

  /* ── SVG FLOWCHART ────────────────────────────── */
  function buildFlowchart() {
    const container = document.getElementById('flowchart');
    if (!container) return;

    const nodes = data.flowchartNodes;
    const NW = 160, NH = 52, GAP = 80;
    const svgW = 400;
    const cx   = svgW / 2;
    const svgH = nodes.length * (NH + GAP) - GAP + 40;

    const NS  = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);
    svg.style.cssText = `width:100%;max-width:400px;display:block;margin:0 auto;overflow:visible;`;

    /* Arrow marker */
    svg.innerHTML = `<defs>
      <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="var(--accent)"/>
      </marker></defs>`;

    const paths = [];

    nodes.forEach((node, i) => {
      const x = cx - NW / 2;
      const y = 20 + i * (NH + GAP);

      /* Connector line from previous node */
      if (i > 0) {
        const prevBottom = 20 + (i - 1) * (NH + GAP) + NH;
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', `M${cx},${prevBottom} L${cx},${y}`);
        p.setAttribute('stroke', 'var(--accent)');
        p.setAttribute('stroke-width', '1.5');
        p.setAttribute('fill', 'none');
        p.setAttribute('marker-end', 'url(#arr)');
        svg.appendChild(p);
        paths.push(p);
      }

      /* Node background */
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', x);       rect.setAttribute('y', y);
      rect.setAttribute('width', NW);   rect.setAttribute('height', NH);
      rect.setAttribute('rx', '6');
      rect.setAttribute('fill',   node.isEnd ? 'var(--accent)' : 'var(--surface)');
      rect.setAttribute('stroke', 'var(--accent)');
      rect.setAttribute('stroke-width', '1.5');
      if (node.isEnd) rect.classList.add('end-node-rect');
      svg.appendChild(rect);

      /* Node label */
      const txt = document.createElementNS(NS, 'text');
      txt.setAttribute('x', cx);
      txt.setAttribute('y', y + NH / 2 + 5);
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('fill', node.isEnd ? '#ffffff' : 'var(--text)');
      txt.setAttribute('font-family', 'Bebas Neue, sans-serif');
      txt.setAttribute('font-size', '13');
      txt.textContent = node.label;
      svg.appendChild(txt);

      /* Invisible overlay for tooltip */
      const ov = document.createElementNS(NS, 'rect');
      ov.setAttribute('x', x);       ov.setAttribute('y', y);
      ov.setAttribute('width', NW);   ov.setAttribute('height', NH);
      ov.setAttribute('fill', 'transparent');
      ov.style.cursor = 'pointer';
      ov.addEventListener('mouseenter', e => tipShow(node.tooltip, e));
      ov.addEventListener('mousemove',  e => tipMove(e));
      ov.addEventListener('mouseleave', tipHide);
      svg.appendChild(ov);
    });

    container.appendChild(svg);

    /* Stroke-dasharray animation on scroll */
    requestAnimationFrame(() => {
      paths.forEach(p => {
        const len = p.getTotalLength();
        p.style.strokeDasharray  = len;
        p.style.strokeDashoffset = len;
      });

      if (reduced) {
        paths.forEach(p => { p.style.strokeDashoffset = '0'; });
        return;
      }

      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        paths.forEach((p, i) => {
          setTimeout(() => {
            p.style.transition = 'stroke-dashoffset 0.6s ease';
            p.style.strokeDashoffset = '0';
          }, i * 150);
        });
        obs.disconnect();
      }, { threshold: 0.1 });
      obs.observe(svg);
    });
  }

  /* Tooltip */
  const tip = document.getElementById('flow-tooltip');
  function tipShow(text, e) { tip.textContent = text; tip.style.opacity = '1'; tipMove(e); }
  function tipMove(e) { tip.style.left = (e.clientX + 14) + 'px'; tip.style.top = (e.clientY - 36) + 'px'; }
  function tipHide() { tip.style.opacity = '0'; }

  /* ── REAL WORLD SCENARIOS ─────────────────────── */
  function buildRealWorld() {
    const grid = document.getElementById('scenarios-grid');
    if (!grid) return;

    /* Skeleton already in HTML — fade out after 800ms */
    setTimeout(() => {
      grid.querySelectorAll('.skeleton-card').forEach(s => {
        s.style.transition = 'opacity 0.3s ease';
        s.style.opacity    = '0';
      });
      setTimeout(() => {
        grid.innerHTML = '';
        data.realWorldScenarios.forEach((s, i) => {
          const card = document.createElement('div');
          card.className = 'scenario-card';
          card.style.animationDelay = `${i * 100}ms`;
          card.innerHTML = `
            <div class="scenario-icon">${s.icon}</div>
            <div class="scenario-title">${s.title}</div>
            <p class="scenario-desc">${s.description}</p>`;
          grid.appendChild(card);
        });
      }, 300);
    }, 800);
  }

  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

})();
