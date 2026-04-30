// krishna-content.js
// Pre-written skill content for Krishna Sahoo's portfolio
// Drop this file in your project root and link it before your main scripts:
// <script src="krishna-content.js"></script>

const KRISHNA_CONTENT = {

  // ─── CORE FOUNDATION PAGE ──────────────────────────────────────────────────

  coreFoundation: {

    pageIntro: `HTML, CSS, and JavaScript aren't just the starting point for me — they're
    the reason I fell in love with building things. I still remember the exact moment
    a button I wrote actually did something on screen. No framework, no library — just
    raw JavaScript talking to the DOM. That feeling of direct control never left me.
    I've worked with frameworks since, but I always come back to these three when
    something breaks, because frameworks are just opinions built on top of these fundamentals.
    If your foundation is shaky, everything else wobbles. These three are why I debug
    confidently, why I'm not scared of "vanilla" projects, and why I can pick up any
    new tool fast — because I understand what it's abstracting.`,

    skills: {
      HTML5: {
        tagline: "STRUCTURE",
        proficiency: 92,
        blurb: `HTML5 is where every idea I've had actually became real on a browser. I once built
        a multi-step form for a college project — no framework, just semantic HTML with fieldsets,
        aria labels, and proper input types. The accessibility and SEO wins were immediate. Developers
        who skip semantics always regret it later. HTML isn't "just markup" — it's the skeleton
        of everything users touch.`
      },
      CSS3: {
        tagline: "STYLE",
        proficiency: 88,
        blurb: `CSS3 taught me that design is logic, not magic. I spent two nights getting a glassmorphism
        card to work perfectly across browsers — that frustration made me deeply understand the cascade,
        specificity, and layout models. When I built my portfolio's animated hero section purely in CSS
        with keyframes and custom properties, I realised CSS is genuinely powerful on its own. Every
        developer should wrestle with raw CSS before reaching for Tailwind.`
      },
      "JavaScript ES6+": {
        tagline: "INTERACTIVITY",
        proficiency: 85,
        blurb: `ES6+ changed how I think, not just what I write. Arrow functions and destructuring were
        surface-level nice, but async/await genuinely rewired my brain around asynchronous logic. I used
        Promises and fetch to pull live GitHub data into a project page — watching real data appear without
        a page reload felt like a superpower. JS is the only language where you feel the web respond to you
        in real time. That feedback loop is addictive.`
      }
    },

    flowchartNodes: [
      { id: "html5",    label: "HTML5",              tooltip: "Semantic structure of every web page" },
      { id: "css3",     label: "CSS3",               tooltip: "Visual layer — layout, colour, animation" },
      { id: "dom",      label: "DOM Manipulation",   tooltip: "JS talking directly to page elements" },
      { id: "events",   label: "Event Handling",     tooltip: "User clicks, keypresses, scroll triggers" },
      { id: "async",    label: "Async Programming",  tooltip: "Promises, async/await, non-blocking logic" },
      { id: "api",      label: "API Integration",    tooltip: "Fetching live data from external services" },
      { id: "result",   label: "FULL DYNAMIC WEBSITE", tooltip: "The real thing — live, interactive, connected", isEnd: true }
    ],

    realWorldScenarios: [
      {
        icon: "📋",
        title: "Multi-Step Registration Form",
        description: "Built a 4-step college event registration form using semantic HTML5, CSS3 animations for step transitions, and vanilla JS for live validation — no libraries needed."
      },
      {
        icon: "🎨",
        title: "Animated Portfolio Hero",
        description: "Designed a CSS-only animated hero section with keyframe text reveals and a glassmorphism card — cross-browser tested and zero JavaScript."
      },
      {
        icon: "⚡",
        title: "Live GitHub Stats Widget",
        description: "Used fetch() and async/await to pull real GitHub contribution data and render it dynamically on a personal project page, updating without any page reload."
      }
    ]
  },


  // ─── FRONTEND & FRAMEWORKS PAGE ────────────────────────────────────────────

  frontendFrameworks: {

    pageIntro: `React didn't just teach me a library — it changed how I think about UI entirely.
    Before React, I was building pages. After React, I started building systems. The shift to
    thinking in components, props, and state made me a more structured developer overall, even
    when I'm writing plain HTML. I remember building my first real React project — a task tracker —
    and realising I could reuse the same card component fifteen times with different data. That
    click of "oh, this is why" is one of the best moments I've had as a developer. Component
    architecture isn't just a React thing; it's a mindset that makes every codebase cleaner,
    every feature easier to add, and every bug easier to isolate.`,

    skills: {
      "React.js": {
        tagline: "COMPONENTS",
        proficiency: 82,
        blurb: `React gave me a mental model I now apply everywhere. I built a project dashboard where
        each widget — charts, task lists, user cards — was its own component with its own state. When a
        feature request came in, I added a new component without touching anything else. That isolation
        is what makes React powerful in team environments. Every frontend developer needs to understand
        component-driven thinking — React just makes it unavoidable.`
      },
      "Responsive Design": {
        tagline: "MOBILE-FIRST",
        proficiency: 90,
        blurb: `Responsive design forced me to stop thinking in pixels and start thinking in proportions.
        I redesigned a club website that was desktop-only, and watching it snap cleanly across mobile,
        tablet, and desktop — with just CSS Grid and media queries — was genuinely satisfying. Mobile-first
        is not optional anymore; most users are on phones. Any developer who codes desktop-first is building
        for yesterday's internet.`
      },
      "UI/UX Design": {
        tagline: "USER FOCUS",
        proficiency: 78,
        blurb: `Good UI is invisible — users don't notice it because it just works. I've started
        applying basic UX principles — contrast ratios, touch target sizes, clear hierarchy — to
        everything I build. When I rebuilt a navigation menu based on user feedback about confusion,
        the drop in "where do I go" questions was immediate. Developers who ignore UX ship technically
        correct products that nobody enjoys using.`
      }
    },

    flowchartNodes: [
      { id: "react",      label: "React.js",              tooltip: "Component-based UI library from Meta" },
      { id: "components", label: "Component Architecture", tooltip: "Reusable, isolated UI building blocks" },
      { id: "state",      label: "State Management",       tooltip: "useState, useEffect, lifting state up" },
      { id: "responsive", label: "Responsive Design",      tooltip: "CSS Grid, Flexbox, media queries" },
      { id: "mobile",     label: "Mobile-First Thinking",  tooltip: "Designing for smallest screen first" },
      { id: "result",     label: "PRODUCTION READY APP",   tooltip: "Shipped, responsive, maintainable UI", isEnd: true }
    ],

    realWorldScenarios: [
      {
        icon: "🗂️",
        title: "Task Tracker Dashboard",
        description: "Built a full React task manager with drag-and-drop, filter by status, and persistent state — each widget a self-contained component that never breaks others."
      },
      {
        icon: "📱",
        title: "Mobile-First Club Website",
        description: "Redesigned a 5-page static club website to be fully responsive using CSS Grid and Flexbox — cut bounce rate on mobile by fixing layout issues that made content unreadable."
      },
      {
        icon: "🎯",
        title: "Portfolio with Component Reuse",
        description: "Built this portfolio in React, reusing a single ProjectCard component across 8+ projects — adding a new project means adding one object to an array, nothing else."
      }
    ]
  },


  // ─── BACKEND & TOOLS PAGE ──────────────────────────────────────────────────

  backendTools: {

    pageIntro: `Before I learned Node.js, I had a frontend and a prayer. The moment I ran my
    first Express server locally and saw it respond to a POST request I sent from my own React
    app, something clicked. I wasn't just building UIs anymore — I was building systems. Firebase
    came later, and it felt like a cheat code: auth, real-time database, hosting, all wired up in
    an afternoon. But the best thing backend knowledge gave me wasn't a tool — it was confidence.
    I stopped treating APIs as black boxes. I understood what was happening on the other side of
    every fetch() call. That understanding makes you a dramatically better frontend developer too,
    because you know exactly what to expect, what can fail, and why. Full-stack isn't a title —
    it's a perspective.`,

    skills: {
      "Node.js": {
        tagline: "RUNTIME",
        proficiency: 78,
        blurb: `Node.js let me take JavaScript — the only language I knew deeply — and run it on a
        server. For a college project, I built a REST API in Node that handled user submissions and
        stored them to a JSON file. It was simple, but it demystified what "backend" means. The
        npm ecosystem alone makes Node worth learning — there's a package for almost every problem.
        Every JavaScript developer should spend time in Node to understand where their frontend code
        actually sends its requests.`
      },
      "Express.js": {
        tagline: "REST APIS",
        proficiency: 74,
        blurb: `Express made routing feel natural. I used it to build a REST API with authentication
        middleware for a full-stack project — each route was clean, each middleware reusable. The
        "just enough" philosophy of Express is what makes it perfect for learning: it doesn't hide
        HTTP from you, it just organises it. Understanding Express means you understand how web
        servers work at a fundamental level — which is something every developer should experience
        at least once.`
      },
      "Firebase": {
        tagline: "REAL-TIME",
        proficiency: 80,
        blurb: `Firebase is where I first shipped a real app with users. Authentication, Firestore,
        and Hosting combined meant I had a working login system and live database in a single
        evening. I built a shared notes app for my study group — anyone could add a note and
        everyone saw it update instantly. That real-time experience, with zero backend server to
        manage, felt like magic. Firebase is how solo developers ship production apps without a
        DevOps team.`
      },
      "Git": {
        tagline: "VERSION CONTROL",
        proficiency: 85,
        blurb: `Git saved me from myself more times than I can count. I once accidentally deleted
        a component I'd spent three hours on — one git checkout and it was back in ten seconds.
        Version control isn't optional for any developer working on anything beyond a single file.
        I now commit with meaningful messages and branch for every feature — habits that became
        second nature once I worked on a group project and saw how badly things break without them.`
      },
      "GitHub": {
        tagline: "COLLABORATION",
        proficiency: 86,
        blurb: `GitHub is my public portfolio and my collaboration layer. I've used pull requests,
        code reviews, and issues on team projects — and I've seen firsthand how much cleaner the
        codebase stays when everyone reviews each other's code. Beyond collaboration, my GitHub
        profile is the first thing a potential collaborator or employer looks at. Keeping it active
        and meaningful matters. Every developer should treat their GitHub like a professional portfolio,
        because it already is one.`
      }
    },

    flowchartNodes: [
      { id: "nodejs",  label: "Node.js",          tooltip: "JavaScript runtime outside the browser" },
      { id: "express", label: "Express.js",        tooltip: "Minimal web framework for routing & middleware" },
      { id: "api",     label: "REST API",          tooltip: "HTTP endpoints — GET, POST, PUT, DELETE" },
      { id: "firebase",label: "Firebase",          tooltip: "Auth, real-time DB, hosting from Google" },
      { id: "auth",    label: "Auth Systems",      tooltip: "Login, signup, protected routes" },
      { id: "git",     label: "Git + GitHub",      tooltip: "Version control and collaboration layer" },
      { id: "result",  label: "LIVE FULL-STACK APP", tooltip: "Deployed, authenticated, real-time application", isEnd: true }
    ],

    realWorldScenarios: [
      {
        icon: "🔐",
        title: "Auth-Protected Notes App",
        description: "Built a shared notes app with Firebase Auth and Firestore — login with Google, create notes, and see everyone's updates in real time without a single page reload."
      },
      {
        icon: "🌐",
        title: "REST API for Event Submissions",
        description: "Wrote an Express REST API for a college fest project that accepted form submissions, validated data via middleware, and stored entries — handling 200+ submissions on event day."
      },
      {
        icon: "🔁",
        title: "Team Project with Git Workflows",
        description: "Led a 4-person group project using feature branches, pull requests, and code reviews on GitHub — merged 30+ PRs with zero major conflicts by enforcing branch discipline."
      }
    ]
  }

};

// Make available globally if not using ES modules
if (typeof module !== "undefined") module.exports = KRISHNA_CONTENT;
