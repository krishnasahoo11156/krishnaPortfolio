/* github-stats.js — API logic, cache system, level systems, and interactive modal renderer */
(function () {
    'use strict';

    const GITHUB_USERNAME = 'krishnasahoo11156';
    const CACHE_KEY = 'gh_analytics_cache';
    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

    const LANGUAGE_COLORS = {
        'javascript': '#f1e05a',
        'typescript': '#3178c6',
        'html': '#e34c26',
        'css': '#563d7c',
        'python': '#3572A5',
        'dart': '#00B4AB',
        'c++': '#f34b7d',
        'c': '#555555',
        'java': '#b07219',
        'php': '#4F5D95',
        'go': '#00ADD8',
        'ruby': '#701516',
        'shell': '#89e051',
        'swift': '#F05138',
        'vue': '#41B883',
        'c#': '#178600',
        'rust': '#dea584',
        'kotlin': '#A97BFF',
        'jupyter notebook': '#DA5B0B'
    };

    // DOM Elements
    const trigger = document.getElementById('github-analytics-trigger');
    const backdrop = document.getElementById('gh-stats-backdrop');
    const closeBtn = document.getElementById('gh-modal-close-btn');
    const skeleton = document.querySelector('.gh-skeleton-container');
    const dynamicContent = document.querySelector('.gh-dynamic-content');

    // Event Listeners for Modal
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (backdrop) {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) {
            closeModal();
        }
    });

    function openModal() {
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
        loadGitHubData();
    }

    function closeModal() {
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Cache Helpers
    function getCache() {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        try {
            const data = JSON.parse(cached);
            const age = Date.now() - data.timestamp;
            if (age < CACHE_DURATION) {
                return data;
            }
        } catch (e) {
            console.error('Error parsing GitHub stats cache:', e);
        }
        return null;
    }

    function setCache(profile, repos) {
        const cacheData = {
            timestamp: Date.now(),
            profile: profile,
            repos: repos
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    }

    // Core Data Fetching
    function loadGitHubData(forceRefresh = false) {
        if (!forceRefresh) {
            const cached = getCache();
            if (cached) {
                renderContent(cached.profile, cached.repos);
                return;
            }
        }

        // Show loading state
        skeleton.style.display = 'flex';
        dynamicContent.style.display = 'none';

        Promise.all([
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}`).then(r => {
                if (!r.ok) throw new Error('Failed to fetch GitHub profile');
                return r.json();
            }),
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`).then(r => {
                if (!r.ok) throw new Error('Failed to fetch GitHub repos');
                return r.json();
            })
        ])
        .then(([profile, repos]) => {
            setCache(profile, repos);
            renderContent(profile, repos);
        })
        .catch(err => {
            console.error('GitHub API error:', err);
            renderErrorState(err);
        });
    }

    // XP & Level calculations
    function calculateLevelDetails(xp) {
        if (xp <= 30) {
            return {
                level: 1,
                tier: 'Rookie',
                minXP: 0,
                maxXP: 30,
                pct: Math.min(100, Math.max(0, (xp / 30) * 100))
            };
        } else if (xp <= 80) {
            return {
                level: 2,
                tier: 'Builder',
                minXP: 30,
                maxXP: 80,
                pct: Math.min(100, Math.max(0, ((xp - 30) / 50) * 100))
            };
        } else if (xp <= 150) {
            return {
                level: 3,
                tier: 'Craftsman',
                minXP: 80,
                maxXP: 150,
                pct: Math.min(100, Math.max(0, ((xp - 80) / 70) * 100))
            };
        } else if (xp <= 300) {
            return {
                level: 4,
                tier: 'Engineer',
                minXP: 150,
                maxXP: 300,
                pct: Math.min(100, Math.max(0, ((xp - 150) / 150) * 100))
            };
        } else {
            return {
                level: 5,
                tier: 'Architect',
                minXP: 300,
                maxXP: 1000,
                pct: 100
            };
        }
    }

    // Language aggregation by repository size
    function aggregateLanguages(repos) {
        const distribution = {};
        let totalSize = 0;

        repos.forEach(repo => {
            if (repo.fork) return; // ignore forks
            const lang = repo.language;
            const size = repo.size; // Size in KB

            if (lang && size > 0) {
                const normalized = lang.toLowerCase();
                distribution[normalized] = (distribution[normalized] || 0) + size;
                totalSize += size;
            }
        });

        if (totalSize === 0) return [];

        const languages = Object.keys(distribution).map(name => {
            const rawName = repos.find(r => r.language && r.language.toLowerCase() === name).language;
            const size = distribution[name];
            const pct = (size / totalSize) * 100;
            return {
                name: rawName,
                pct: Math.round(pct * 10) / 10,
                color: LANGUAGE_COLORS[name] || '#8a8a9a'
            };
        });

        // Sort descending by percentage
        return languages.sort((a, b) => b.pct - a.pct);
    }

    // Account Age calculation in years
    function calculateAccountAge(createdAtString) {
        const created = new Date(createdAtString);
        const now = new Date();
        const diffMs = now - created;
        const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
        return Math.round(years * 10) / 10;
    }

    // UI Rendering
    function renderContent(profile, repos) {
        // Calculate variables
        const nonForkRepos = repos.filter(r => !r.fork);
        const totalStars = nonForkRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
        const publicReposCount = profile.public_repos;
        const followers = profile.followers;
        const accountAge = calculateAccountAge(profile.created_at);

        // XP Formula
        const xp = totalStars + (publicReposCount * 2) + (followers * 3);
        const levelDetails = calculateLevelDetails(xp);

        // Aggregated languages
        const languages = aggregateLanguages(repos);

        // Top repositories (sorted by stars, max 4)
        const topRepos = [...nonForkRepos]
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 4);

        // Build HTML
        let html = '';

        // 1. Profile Header
        html += `
            <div class="gh-profile-header">
                <div class="gh-avatar-container">
                    <img src="${profile.avatar_url}" alt="${profile.name || GITHUB_USERNAME}" class="gh-avatar">
                </div>
                <div class="gh-header-info">
                    <div class="gh-name-row">
                        <span class="gh-display-name">${profile.name || GITHUB_USERNAME}</span>
                        <span class="gh-pro-badge">PRO</span>
                    </div>
                    <div class="gh-username-line">
                        <a href="${profile.html_url}" target="_blank" rel="noopener">@${profile.login} ↗</a>
                    </div>
                    <div class="gh-achievements-row">
                        <span class="gh-achievement-badge gh-badge-arctic" title="Arctic Code Vault Contributor">Arctic Code Vault</span>
                        <span class="gh-achievement-badge gh-badge-shark" title="Merged multiple PRs">Pull Shark</span>
                        <span class="gh-achievement-badge gh-badge-yolo" title="Pushed directly to main">YOLO</span>
                        <span class="gh-achievement-badge gh-badge-quickdraw" title="Fast response to issues/PRs">Quickdraw</span>
                    </div>
                </div>
            </div>
        `;

        // 2. Level and XP bar
        html += `
            <div class="gh-level-container">
                <div class="gh-level-header">
                    <span class="gh-level-title">LEVEL ${levelDetails.level} — ${levelDetails.tier.toUpperCase()}</span>
                    <span class="gh-level-xp">${xp} XP</span>
                </div>
                <div class="gh-level-progress-track">
                    <div class="gh-level-progress-fill" style="width: 0%;" data-target-width="${levelDetails.pct}%"></div>
                </div>
            </div>
        `;

        // 3. Stats Cards Grid
        html += `
            <div class="gh-stats-grid">
                <div class="gh-stat-card">
                    <div class="gh-stat-num">${followers}</div>
                    <div class="gh-stat-label">Followers</div>
                </div>
                <div class="gh-stat-card">
                    <div class="gh-stat-num">${publicReposCount}</div>
                    <div class="gh-stat-label">Repositories</div>
                </div>
                <div class="gh-stat-card">
                    <div class="gh-stat-num">${totalStars}</div>
                    <div class="gh-stat-label">Total Stars</div>
                </div>
                <div class="gh-stat-card">
                    <div class="gh-stat-num">${accountAge}y</div>
                    <div class="gh-stat-label">Account Age</div>
                </div>
            </div>
        `;

        // 4. Language Distribution stacked bar and legend
        if (languages.length > 0) {
            html += `
                <div class="gh-languages-wrapper">
                    <div class="gh-section-title">LANGUAGE DISTRIBUTION</div>
                    <div class="gh-lang-bar">
            `;
            languages.forEach(lang => {
                html += `
                    <div class="gh-lang-segment" style="width: ${lang.pct}%; background-color: ${lang.color};">
                        <span class="gh-tooltip">${lang.name}: ${lang.pct}%</span>
                    </div>
                `;
            });
            html += `
                    </div>
                    <div class="gh-lang-legend">
            `;
            languages.slice(0, 8).forEach(lang => {
                html += `
                    <div class="gh-lang-legend-item">
                        <span class="gh-lang-color-dot" style="background-color: ${lang.color};"></span>
                        <span>${lang.name} (${lang.pct}%)</span>
                    </div>
                `;
            });
            html += `
                    </div>
                </div>
            `;
        }

        // 5. Contribution Calendar (using ghchart)
        html += `
            <div class="gh-calendar-wrapper">
                <div class="gh-section-title">CONTRIBUTION CALENDAR</div>
                <div class="gh-calendar-box">
                    <img src="https://ghchart.rshah.org/e8473f/${GITHUB_USERNAME}" alt="${GITHUB_USERNAME} contribution calendar" class="gh-calendar-img" loading="lazy">
                </div>
            </div>
        `;

        // 6. Top Repositories Grid
        if (topRepos.length > 0) {
            html += `
                <div class="gh-repos-wrapper">
                    <div class="gh-section-title">
                        <span>TOP REPOSITORIES</span>
                        <button id="gh-stats-refresh-btn" style="background:none; border:none; color:var(--text-tertiary); cursor:pointer; font-size:10px; font-family:'Courier New',monospace; letter-spacing:1px; text-transform:uppercase; padding:2px 8px; border:1px solid var(--border-color); display:flex; align-items:center; gap:4px; transition:all 0.2s;">
                            <span>↻ REFRESH DATA</span>
                        </button>
                    </div>
                    <div class="gh-repos-grid">
            `;
            topRepos.forEach(repo => {
                const repoLang = repo.language || 'Plain Text';
                const langColor = LANGUAGE_COLORS[repoLang.toLowerCase()] || '#8a8a9a';
                html += `
                    <div class="gh-repo-card">
                        <div class="gh-repo-header">
                            <h4 class="gh-repo-title">
                                <a href="${repo.html_url}" target="_blank" rel="noopener">
                                    ${repo.name} <span>↗</span>
                                </a>
                            </h4>
                        </div>
                        <p class="gh-repo-desc">${repo.description || 'No description provided.'}</p>
                        <div class="gh-repo-footer">
                            <span class="gh-repo-lang">
                                <span class="gh-lang-color-dot" style="background-color: ${langColor};"></span>
                                <span>${repoLang}</span>
                            </span>
                            <div class="gh-repo-stats">
                                <span class="gh-repo-stat-item" title="Stars">
                                    <span style="font-size: 13px;">★</span>
                                    <span>${repo.stargazers_count}</span>
                                </span>
                                <span class="gh-repo-stat-item" title="Forks">
                                    <span style="font-size: 11px;">⑂</span>
                                    <span>${repo.forks_count}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += `
                    </div>
                </div>
            `;
        }

        // Output to DOM
        dynamicContent.innerHTML = html;

        // Hide skeleton and show content
        skeleton.style.display = 'none';
        dynamicContent.style.display = 'block';

        // Animate Level Bar width
        requestAnimationFrame(() => {
            const fill = dynamicContent.querySelector('.gh-level-progress-fill');
            if (fill) {
                const targetWidth = fill.getAttribute('data-target-width');
                setTimeout(() => {
                    fill.style.width = targetWidth;
                }, 150);
            }
        });

        // Setup Refresh Button Action
        const refreshBtn = document.getElementById('gh-stats-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loadGitHubData(true);
            });
        }
    }

    function renderErrorState(err) {
        skeleton.style.display = 'none';
        dynamicContent.style.display = 'block';
        dynamicContent.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; border: 1px solid var(--accent-color); background: rgba(232, 71, 63, 0.04); margin: 2rem 0;">
                <span style="font-size: 2rem; display: block; margin-bottom: 1rem;">⚠️</span>
                <h3 style="font-family: var(--font-heading); color: var(--text-primary); font-size: 20px; letter-spacing: 1px; margin-bottom: 0.5rem;">FAILED TO RESOLVE DATA</h3>
                <p style="font-family: var(--font-body); color: var(--text-secondary); font-size: 13px; max-width: 460px; margin: 0 auto 1.5rem; line-height: 1.6;">
                    GitHub API requests failed. This usually happens when the maximum hourly rate limit is reached, or when you are offline.
                </p>
                <button id="gh-stats-retry-btn" class="proj-btn" style="font-size: 10px; padding: 8px 20px; cursor: pointer;">RETRY FETCH</button>
            </div>
        `;

        const retryBtn = document.getElementById('gh-stats-retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loadGitHubData(true);
            });
        }
    }

})();
