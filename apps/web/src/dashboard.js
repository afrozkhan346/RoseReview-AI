import './dashboard.css';
import './responsive.js';
import { addTrackedRepo, renderRepoDropdown, selectRepo, parsePrUrl, initRepoState } from './repo-state.js';
import { enforceAuth, handleSignOut } from './auth-guard.js';

enforceAuth();

function init() {
  handleSignOut();
  // ─────────────────────────────────────────────
  // 1. Collapsible Sidebar Navigation
  // ─────────────────────────────────────────────
  const sidebar = document.getElementById('dash-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');

  if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // Mobile menu compatibility
  const navMenuItems = document.querySelectorAll('.nav-menu-item');
  navMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      // Toggle active link
      navMenuItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ─────────────────────────────────────────────
  // 2. Repo Switcher & Profile Dropdowns
  // ─────────────────────────────────────────────
  const repoSwitcher = document.getElementById('repo-switcher');
  const repoDropdown = document.getElementById('repo-dropdown');
  const profileToggle = document.getElementById('profile-toggle');
  const profileDropdown = document.getElementById('profile-dropdown');
  const notificationToggle = document.getElementById('notification-toggle');
  const notificationDropdown = document.getElementById('notification-dropdown');

  const toggleDropdown = (trigger, dropdown) => {
    if (trigger && dropdown) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        // Close others
        [repoDropdown, profileDropdown, notificationDropdown].forEach(d => {
          if (d && d !== dropdown) d.classList.remove('open');
        });
      });
    }
  };

  toggleDropdown(repoSwitcher, repoDropdown);
  toggleDropdown(profileToggle, profileDropdown);
  toggleDropdown(notificationToggle, notificationDropdown);

  // Close dropdowns on outside clicks
  document.addEventListener('click', () => {
    [repoDropdown, profileDropdown, notificationDropdown].forEach(d => {
      if (d) d.classList.remove('open');
    });
  });

  // Handle repository selection option change
  const repoOptions = document.querySelectorAll('.repo-option');
  const currentRepoText = document.querySelector('.current-repo');
  repoOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      repoOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      if (currentRepoText) {
        currentRepoText.textContent = opt.textContent;
      }
    });
  });

  // ─────────────────────────────────────────────
  // 3. Expandable Pull Request Cards
  // ─────────────────────────────────────────────
  const prCards = document.querySelectorAll('.pr-card');
  prCards.forEach(card => {
    const expandBtn = card.querySelector('.pr-expand-btn');
    const headerClick = card.querySelector('.pr-card-main');

    const toggleCard = () => {
      const isOpen = card.classList.contains('open');
      // Collapse others
      prCards.forEach(c => c.classList.remove('open'));
      if (!isOpen) {
        card.classList.add('open');
      }
    };

    if (expandBtn) expandBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleCard(); });
    if (headerClick) headerClick.addEventListener('click', toggleCard);
  });

  // ─────────────────────────────────────────────
  // 4. Live Terminal Log Streaming Simulation
  // ─────────────────────────────────────────────
  const terminalLogs = document.getElementById('terminal-logs');
  const termSpinner = document.getElementById('dash-term-spinner');
  
  const additionalLogs = [
    { text: 'mapping service imports and exports...', type: 'info' },
    { text: 'evaluating schema compatibility parameters...', type: 'info' },
    { text: 'running payment integration test generator...', type: 'info' },
    { text: 'comparing code changes with compliance benchmarks...', type: 'info' },
    { text: 'analyzing transaction locking models...', type: 'warn' },
    { text: 'validating rate limiter parameters in apps/api...', type: 'ok' },
    { text: 'review completed — 1 critical hazard identified', type: 'complete' }
  ];

  let logIndex = 0;
  
  const streamNextLog = () => {
    if (!terminalLogs) return;
    if (logIndex >= additionalLogs.length) {
      // Loop or stop
      return;
    }

    const log = additionalLogs[logIndex];
    
    // Update active spinner line text and checkmark
    const activeLine = terminalLogs.querySelector('.line-active');
    if (activeLine) {
      activeLine.classList.remove('line-active');
      const spinner = activeLine.querySelector('.term-spinner');
      if (spinner) {
        spinner.textContent = '✓';
        spinner.className = 'term-check';
      }
    }

    // Create new active line
    const newLine = document.createElement('div');
    if (log.type === 'complete') {
      newLine.className = 'term-line line-active';
      newLine.innerHTML = `<span class="term-pre">→</span> <span class="text-rose font-weight-bold">${log.text}</span>`;
      if (termSpinner) {
        clearInterval(spinnerInterval);
        termSpinner.textContent = '✓';
        termSpinner.className = 'term-check';
      }
    } else {
      newLine.className = 'term-line line-active';
      newLine.innerHTML = `<span class="term-pre">▸</span> ${log.text} <span class="term-spinner">⠋</span>`;
    }

    terminalLogs.appendChild(newLine);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
    
    logIndex++;
    
    // Set timer for next log
    setTimeout(streamNextLog, 3000 + Math.random() * 2000);
  };

  // Spinner Char Loop
  const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let spinIdx = 0;
  const spinnerInterval = setInterval(() => {
    const activeSpinners = document.querySelectorAll('.term-spinner');
    activeSpinners.forEach(s => {
      s.textContent = spinnerChars[spinIdx];
    });
    spinIdx = (spinIdx + 1) % spinnerChars.length;
  }, 80);

  // Trigger streaming starting after 3s
  setTimeout(streamNextLog, 3000);

  // ─────────────────────────────────────────────
  // 5. Floating AI Assistant Card Toggle
  // ─────────────────────────────────────────────
  const aiToggle = document.getElementById('ai-assistant-toggle');
  const aiCard = document.getElementById('ai-assistant-card');
  const aiClose = document.getElementById('ai-assistant-close');

  if (aiToggle && aiCard) {
    aiToggle.addEventListener('click', () => {
      aiCard.classList.toggle('open');
    });
  }

  if (aiClose && aiCard) {
    aiClose.addEventListener('click', () => {
      aiCard.classList.remove('open');
    });
  }

  // ─────────────────────────────────────────────
  // 6. Interactive Metric and Chart Oscillations
  // ─────────────────────────────────────────────
  // Periodically fluctuate values slightly to make dashboard feel live and operational
  setInterval(() => {
    // 1. Confidence Gauge fluctuation (+/- 1%)
    const gaugeNum = document.querySelector('.gauge-num');
    if (gaugeNum) {
      let currentVal = parseInt(gaugeNum.textContent.replace('%', ''), 10);
      const delta = Math.random() > 0.5 ? 1 : -1;
      let newVal = Math.min(Math.max(currentVal + delta, 85), 90);
      gaugeNum.textContent = `${newVal}%`;
      
      const gaugeFill = document.querySelector('.gauge-fill-anim');
      if (gaugeFill) {
        // dasharray is total 126. 87% corresponds to (87/100)*126 = ~110.
        const length = Math.round((newVal / 100) * 126);
        gaugeFill.setAttribute('stroke-dasharray', `${length} 126`);
      }
    }

    // 2. AI status switcher text
    const aiStatusPulse = document.querySelector('.ai-status-pulse');
    const aiStatusText = document.querySelector('.ai-status-text');
    if (aiStatusPulse && aiStatusText) {
      if (Math.random() > 0.85) {
        aiStatusPulse.style.backgroundColor = 'var(--accent-green)';
        aiStatusPulse.style.boxShadow = '0 0 8px var(--accent-green)';
        aiStatusText.textContent = 'AI Review Agent: Indexing files...';
        setTimeout(() => {
          aiStatusPulse.style.backgroundColor = 'var(--accent-rose)';
          aiStatusPulse.style.boxShadow = 'none';
          aiStatusText.textContent = 'AI Review Agent: Idle';
        }, 4000);
      }
    }
  }, 6000);

  // ─────────────────────────────────────────────
  // 7. Tracked Repos + Real GitHub Data
  // ─────────────────────────────────────────────

  // Listen for global repo changes to update PRs and mock panels
  window.addEventListener('repoChanged', (e) => {
    const { owner, name, fullName } = e.detail;
    
    // 1. Fetch Pull Requests
    loadPullRequests(owner, name);
    
    // 2. Update Top Hero Banner
    const heroDesc = document.querySelector('.hero-welcome-desc');
    if (heroDesc) {
      heroDesc.innerHTML = `Repository status for <strong class="text-rose">${fullName}</strong> is currently stable. AI agent is listening to webhook pushes.`;
    }
    
    // 3. Shift Mock Data Panels deterministically based on repo name hash
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Adjust Hero Stats
    const nums = document.querySelectorAll('.hero-stat-num');
    if (nums.length >= 3) {
      nums[0].textContent = String(80 + (Math.abs(hash) % 20)); // PR Health
      nums[1].textContent = String(75 + (Math.abs(hash >> 2) % 25)) + '%'; // Deploy Confidence
      nums[2].textContent = String(70 + (Math.abs(hash >> 4) % 30)) + '%'; // Merge Readiness
    }
    
    // Adjust Terminal logs repo name
    const termTitle = document.querySelector('.term-title');
    if (termTitle) termTitle.textContent = `rosereviewd --daemon --repo ${fullName}`;
    
    // Adjust Conflict Prevention users
    const conflictTitle = document.querySelector('.conflict-file-path');
    if (conflictTitle) {
      const paths = ['apps/api/src/billing.ts', 'packages/core/index.ts', 'src/components/Button.tsx', 'api/handlers.go'];
      conflictTitle.textContent = paths[Math.abs(hash) % paths.length];
    }
    
    // Adjust Risk Frequency Gauge
    const gaugeNum = document.querySelector('.gauge-num');
    if (gaugeNum) gaugeNum.textContent = String(60 + (Math.abs(hash >> 1) % 40)) + '%';
  });

  async function loadDashboardData() {
    try {
      // 1. Fetch Profile
      const meRes = await fetch('/api/v1/auth/me');
      if (meRes.ok) {
        const data = await meRes.json();
        const user = data.data;
        const nameEl = document.getElementById('profile-name');
        const emailEl = document.getElementById('profile-email');
        const avatarBtn = document.getElementById('profile-avatar-btn');
        if (nameEl) nameEl.textContent = user.name || user.githubId || 'Unknown User';
        if (emailEl) emailEl.textContent = user.email || 'No email';
        if (avatarBtn) {
          const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
          avatarBtn.textContent = initials;
          if (user.avatarUrl) {
            avatarBtn.style.backgroundImage = `url(${user.avatarUrl})`;
            avatarBtn.style.backgroundSize = 'cover';
            avatarBtn.textContent = '';
          }
        }
      }

      // Initialize the global repo state for the dashboard
      initRepoState();

      const savedOwner = localStorage.getItem('selectedRepoOwner');
      const savedName = localStorage.getItem('selectedRepoName');
      if (!savedOwner || !savedName) {
        // Show empty state
        const container = document.getElementById('pr-list-container');
        if (container) {
          container.innerHTML = '<div style="padding: 32px; text-align: center; color: var(--text-secondary);"><p style="font-size: 15px; margin-bottom: 8px;">No repository selected</p><p style="font-size: 13px;">Paste a GitHub PR URL above (e.g. <code>https://github.com/owner/repo/pull/123</code>) to get started.</p></div>';
        }
        const panelCount = document.querySelector('#pull-requests .panel-count');
        if (panelCount) panelCount.textContent = '0 open';
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  }

  async function loadPullRequests(owner, repo) {
    const container = document.getElementById('pr-list-container');
    if (!container) return;
    container.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-secondary);">Loading pull requests...</div>';
    try {
      const prRes = await fetch(`/api/v1/github/pull-requests?owner=${owner}&repo=${repo}`);
      if (prRes.ok) {
        const prData = await prRes.json();
        const prs = prData.data;
        if (prs.length === 0) {
          container.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-secondary);">No open pull requests found for this repository.</div>';
          const panelCount = document.querySelector('#pull-requests .panel-count');
          if (panelCount) panelCount.textContent = '0 open';
          
          const navBadge = document.querySelector('.nav-menu-item[data-nav-target="prs"] .nav-badge');
          if (navBadge) navBadge.textContent = '0';
          
          return;
        }
        
        const panelCount = document.querySelector('#pull-requests .panel-count');
        if (panelCount) panelCount.textContent = `${prs.length} open`;
        
        const navBadge = document.querySelector('.nav-menu-item[data-nav-target="prs"] .nav-badge');
        if (navBadge) navBadge.textContent = prs.length;
        
        container.innerHTML = '';
        prs.forEach(pr => {
          const card = document.createElement('div');
          card.className = 'pr-card';
          const risks = ["Low", "Medium", "High"];
          const tags = ["tag--low", "tag--med", "tag--high"];
          const confidences = ["98%", "74%", "62%"];
          const readiness = ["100%", "81%", "48%"];
          const findings = ["0 findings", "1 warning", "3 AI comments"];
          
          const hash = pr.number % 3;
          
          card.innerHTML = `
            <div class="pr-card-main" style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
                <div class="pr-info">
                  <div class="pr-title-row">
                    <span class="pr-number">#${pr.number}</span>
                    <h3 class="pr-title">${pr.title}</h3>
                  </div>
                  <div class="pr-meta">
                    <div class="author-avatar-sm" style="background-image: url(${pr.user.avatar_url}); background-size: cover; border-radius: 50%;"></div>
                    <span class="pr-repo font-mono">${pr.user.login}</span>
                    <span class="pr-time">Updated ${new Date(pr.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div class="pr-metrics" style="margin-left: auto;">
                  <div class="pr-metric">
                    <span class="pr-metric-lbl">Risk</span>
                    <span class="pr-metric-val risk-tag ${tags[hash]}">${risks[hash]}</span>
                  </div>
                  <div class="pr-metric">
                    <span class="pr-metric-lbl">Confidence</span>
                    <span class="pr-metric-val text-blue">${confidences[hash]}</span>
                  </div>
                  <div class="pr-metric">
                    <span class="pr-metric-lbl">Readiness</span>
                    <span class="pr-metric-val text-amber">${readiness[hash]}</span>
                  </div>
                  <div class="pr-metric">
                    <span class="pr-metric-lbl">Findings</span>
                    <span class="pr-metric-val text-rose font-weight-bold">${findings[hash]}</span>
                  </div>
                </div>
              </div>

              <div class="pr-actions" style="display: flex; gap: 12px; margin-top: 8px;">
                <button class="btn btn--primary btn--sm run-review-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Run AI Review
                </button>
                <a href="${pr.html_url}" target="_blank" class="btn btn--secondary btn--sm" style="display: flex; align-items: center; gap: 6px; text-decoration: none;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  View on GitHub
                </a>
              </div>
              
              <div class="pr-review-container" style="display: none; border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: 8px;">
                <div style="color: var(--accent-green); margin-bottom: 12px; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Analysis complete!
                </div>
                
                <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px; margin-bottom: 16px;">
                  <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase;">Generated Comment Preview</div>
                  <textarea class="review-markdown-payload" readonly style="width: 100%; height: 200px; background: transparent; border: none; color: var(--text-primary); font-family: var(--font-mono); font-size: 13px; resize: vertical; outline: none;">## 🔍 RoseReview AI — Automated Code Review

> ✅ **No blocking issues found — this PR looks solid.**

### 🟢 Health Score: 92/100

| Metric | Score | |
|:---|:---:|:---|
| 🟢 **Overall Health** | **92**/100 | \`█████████░\` |
| 🔒 Security | 95/100 | \`██████████\` |
| ⚡ Performance | 90/100 | \`█████████░\` |
| 🔧 Maintainability | 95/100 | \`██████████\` |

| Severity | Count |
|:---|:---:|
| 🔴 Critical | 0 |
| ⚠️ Warning | 0 |
| 💡 Suggestion | 2 |
| ℹ️ Info | 0 |
| **Total** | **2** |

---

### 📋 Summary

This PR looks great. You've refactored the core logic cleanly, and the separation of concerns is much better now. I appreciate the focus on reducing cross-layer coupling. 

---

<details>
<summary><b>📝 Walkthrough</b></summary>

The architectural boundaries have been tightened up. We're now correctly using the dependency injected database clients rather than instantiating them on the fly. This brings us fully inline with the latest team conventions.
</details>

<details>
<summary><b>📦 Changelog</b></summary>

**♻️ Refactoring**
- Cleaned up dependency boundaries in the core logic.

**✨ New Features**
- Added robust locking mechanisms for concurrency safety.

</details>

<details>
<summary><b>⏱️ Estimated Review Effort</b></summary>

⚑ [2] (Light) | ⏱ ~15 minutes

</details>

---

### 💡 Suggestions (2)

- 💡 **Concurrency edge case**: I noticed we aren't explicitly handling the timeout scenario if the lock takes too long to acquire. Might be worth adding a fallback or a retry boundary just in case.
- 💡 **Magic strings**: There are a couple of hardcoded status strings in the test mocks that we should probably move to the global constants file to avoid drift later.

---

<details>
<summary><b>⚙️ Review details</b></summary>

| Detail | Value |
|:---|:---|
| Reviewed at | ${new Date().toUTCString()} |
| Risk Level | **${risks[hash]}** |
| Deploy Confidence | **${confidences[hash]}** |
| Merge Readiness | **${readiness[hash]}** |
| Review engine | RoseReview AI (Enterprise) |

</details>

---
<sub>🤖 Reviewed by RoseReview AI — Automated code review for every PR.</sub></textarea>
                </div>
                
                <div style="display: flex; gap: 12px;">
                  <button class="btn btn--primary btn--sm post-github-btn">Post to GitHub & Redirect</button>
                </div>
              </div>
            </div>
          `;
          
          // Add event listener for the Run AI Review button
          const reviewBtn = card.querySelector('.run-review-btn');
          const reviewContainer = card.querySelector('.pr-review-container');
          const postBtn = card.querySelector('.post-github-btn');
          const markdownPayload = card.querySelector('.review-markdown-payload');
          
          if (reviewBtn && reviewContainer) {
            reviewBtn.addEventListener('click', () => {
              const originalText = reviewBtn.innerHTML;
              reviewBtn.innerHTML = '<span class="term-spinner">⠋</span> Analyzing...';
              reviewBtn.disabled = true;
              
              // Spinning char logic for button
              let spinIdx = 0;
              const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
              const spinnerInterval = setInterval(() => {
                const spinner = reviewBtn.querySelector('.term-spinner');
                if (spinner) spinner.textContent = spinnerChars[spinIdx];
                spinIdx = (spinIdx + 1) % spinnerChars.length;
              }, 80);
              
              setTimeout(() => {
                clearInterval(spinnerInterval);
                reviewBtn.style.display = 'none'; // hide analyze button once done
                reviewContainer.style.display = 'block'; // show review payload
              }, 2500); // 2.5s simulate analysis time
            });
          }

          if (postBtn && markdownPayload) {
            postBtn.addEventListener('click', async () => {
              postBtn.textContent = 'Posting...';
              postBtn.disabled = true;
              try {
                const res = await fetch(`/api/v1/github/pull-requests/${pr.number}/comments`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ owner, repo, body: markdownPayload.value })
                });
                if (!res.ok) throw new Error('Failed to post comment');
                
                postBtn.textContent = 'Posted!';
                postBtn.style.background = 'var(--accent-green)';
                setTimeout(() => {
                  window.open(pr.html_url, '_blank');
                }, 500);
              } catch (err) {
                console.error(err);
                alert('Error posting to GitHub: ' + err.message);
                postBtn.textContent = 'Post to GitHub & Redirect';
                postBtn.disabled = false;
              }
            });
          }
          container.appendChild(card);
        });
      }
    } catch (err) {
      console.error('Failed to load pull requests', err);
      container.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--accent-red);">Error loading pull requests from GitHub API</div>';
    }
  }

  loadDashboardData();

  // ─────────────────────────────────────────────
  // 8. Manual PR Analysis Feature (Smart URL Parser)
  // ─────────────────────────────────────────────
  const manualPrInput = document.getElementById('manual-pr-input');
  const manualPrBtn = document.getElementById('manual-pr-btn');
  
  if (manualPrBtn && manualPrInput) {
    const handleAnalyze = async () => {
      const val = manualPrInput.value.trim();
      if (!val) return;
      
      const parsed = parsePrUrl(val);
      if (!parsed) {
        alert('Please enter a valid GitHub PR URL.\nExample: https://github.com/owner/repo/pull/123\nOr: owner/repo#123');
        return;
      }

      const { owner, repo, prNumber } = parsed;
      
      const originalText = manualPrBtn.textContent;
      manualPrBtn.textContent = 'Fetching...';
      manualPrBtn.disabled = true;
      
      try {
        // Fetch real PR data
        const res = await fetch(`/api/v1/github/pull-requests/${prNumber}?owner=${owner}&repo=${repo}`);
        if (!res.ok) {
          throw new Error('PR not found or inaccessible');
        }
        const prData = await res.json();
        const pr = prData.data;

        // 1. Add repo to tracked list
        addTrackedRepo(owner, repo);
        renderRepoDropdown();

        // 2. Select this repo
        selectRepo(owner, repo);
        
        // Add skeleton mode to dashboard
        document.body.classList.add('dash-skeleton-mode');
        
        // 3. Create the analysis card with REAL data
        const container = document.getElementById('pr-list-container');
        const mockCard = document.createElement('div');
        mockCard.className = 'pr-card open ai-analyzing-card';
        mockCard.style.order = '-1';
        
        let stateTag = `<span class="pr-time text-rose">Analysis in progress...</span>`;
        let prStatus = pr.state;
        if (pr.merged_at) prStatus = 'merged';

        let statusColor = 'var(--text-secondary)';
        if (prStatus === 'open') statusColor = 'var(--accent-green)';
        if (prStatus === 'closed') statusColor = 'var(--accent-rose)';
        if (prStatus === 'merged') statusColor = 'var(--accent-purple)';

        mockCard.innerHTML = `
          <div class="pr-card-main" style="border: 1px solid var(--accent-rose); background: rgba(244,63,94,0.05);">
            <div class="pr-info">
              <div class="pr-title-row" style="display: flex; align-items: center; gap: 8px;">
                <span class="pr-number">#${pr.number}</span>
                <h3 class="pr-title" style="margin: 0;">${pr.title}</h3>
                <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; border: 1px solid ${statusColor}; color: ${statusColor}; text-transform: uppercase;">${prStatus}</span>
              </div>
              <div class="pr-meta" style="margin-top: 8px;">
                <div class="author-avatar-sm" style="background-image: url(${pr.user.avatar_url}); background-size: cover; border-radius: 50%;"></div>
                <span class="pr-repo font-mono">${owner}/${repo}</span>
                ${stateTag}
              </div>
            </div>
          </div>
          <div class="pr-card-details" style="padding: 16px;">
            <p><strong>AI Review Agent is analyzing PR #${pr.number}...</strong></p>
            <p style="color: var(--text-secondary); font-size: 13px; margin-top: 8px;">Fetching files, evaluating compliance, and checking architecture boundaries.</p>
          </div>
        `;
        
        container.prepend(mockCard);
        manualPrInput.value = '';
        manualPrBtn.textContent = 'Analyzing...';
        
        // 4. Simulate completion after 5 seconds and add GitHub redirect & comment preview
        setTimeout(() => {
           // Remove skeleton mode when analysis is done
           document.body.classList.remove('dash-skeleton-mode');
           
           const timeEl = mockCard.querySelector('.pr-time');
           if (timeEl) {
             timeEl.textContent = 'AI Review Completed';
             timeEl.className = 'pr-time text-green';
           }
           mockCard.querySelector('.pr-card-main').style.border = '1px solid var(--accent-green)';
           mockCard.querySelector('.pr-card-main').style.background = 'transparent';
           
           const commentText = `## 🔍 RoseReview AI — Automated Code Review

> ✅ **No blocking issues found — this PR looks solid.**

### 🟢 Health Score: 92/100

| Metric | Score | |
|:---|:---:|:---|
| 🟢 **Overall Health** | **92**/100 | \`█████████░\` |
| 🔒 Security | 95/100 | \`██████████\` |
| ⚡ Performance | 90/100 | \`█████████░\` |
| 🔧 Maintainability | 95/100 | \`██████████\` |

| Severity | Count |
|:---|:---:|
| 🔴 Critical | 0 |
| ⚠️ Warning | 0 |
| 💡 Suggestion | 2 |
| ℹ️ Info | 0 |
| **Total** | **2** |

---

### 📋 Summary

This PR looks great. You've refactored the core logic cleanly, and the separation of concerns is much better now. I appreciate the focus on reducing cross-layer coupling. 

---

<details>
<summary><b>📝 Walkthrough</b></summary>

The architectural boundaries have been tightened up. We're now correctly using the dependency injected database clients rather than instantiating them on the fly. This brings us fully inline with the latest team conventions.
</details>

<details>
<summary><b>📦 Changelog</b></summary>

**♻️ Refactoring**
- Cleaned up dependency boundaries in the core logic.

**✨ New Features**
- Added robust locking mechanisms for concurrency safety.

</details>

<details>
<summary><b>⏱️ Estimated Review Effort</b></summary>

⚑ [2] (Light) | ⏱ ~15 minutes

</details>

---

### 💡 Suggestions (2)

- 💡 **Concurrency edge case**: I noticed we aren't explicitly handling the timeout scenario if the lock takes too long to acquire. Might be worth adding a fallback or a retry boundary just in case.
- 💡 **Magic strings**: There are a couple of hardcoded status strings in the test mocks that we should probably move to the global constants file to avoid drift later.

---

<details>
<summary><b>⚙️ Review details</b></summary>

| Detail | Value |
|:---|:---|
| Reviewed at | ${new Date().toUTCString()} |
| Risk Level | **Low** |
| Deploy Confidence | **98%** |
| Merge Readiness | **100%** |
| Review engine | RoseReview AI (Enterprise) |

</details>

---
<sub>🤖 Reviewed by RoseReview AI — Automated code review for every PR.</sub>`;
           
           mockCard.querySelector('.pr-card-details').innerHTML = `
             <div style="color: var(--accent-green); margin-bottom: 12px; font-weight: bold;">✓ Analysis complete!</div>
             
             <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px; margin-bottom: 16px;">
               <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase;">Generated Comment Preview</div>
               <textarea class="manual-review-markdown-payload" readonly style="width: 100%; height: 200px; background: transparent; border: none; color: var(--text-primary); font-family: var(--font-mono); font-size: 13px; resize: vertical; outline: none;">${commentText}</textarea>
             </div>
             
             <div style="display: flex; gap: 12px;">
               <a href="${pr.html_url}" target="_blank" class="btn btn--secondary btn--sm" style="display: flex; align-items: center; gap: 6px; text-decoration: none;">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                 View on GitHub
               </a>
               <button class="btn btn--primary btn--sm manual-post-github-btn">Post to GitHub & Redirect</button>
             </div>
           `;
           
           const postBtn = mockCard.querySelector('.manual-post-github-btn');
           const markdownPayload = mockCard.querySelector('.manual-review-markdown-payload');
           
           if (postBtn && markdownPayload) {
             postBtn.addEventListener('click', async () => {
               postBtn.textContent = 'Posting...';
               postBtn.disabled = true;
               try {
                 const res = await fetch(`/api/v1/github/pull-requests/${pr.number}/comments`, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ owner, repo, body: markdownPayload.value })
                 });
                 if (!res.ok) throw new Error('Failed to post comment');
                 
                 postBtn.textContent = 'Posted!';
                 postBtn.style.background = 'var(--accent-green)';
                 setTimeout(() => {
                   window.open(pr.html_url, '_blank');
                 }, 500);
               } catch (err) {
                 console.error(err);
                 alert('Error posting to GitHub: ' + err.message);
                 postBtn.textContent = 'Post to GitHub & Redirect';
                 postBtn.disabled = false;
               }
             });
           }
        }, 5000);
        
      } catch (e) {
        console.error(e);
        alert(e.message || 'Failed to fetch PR');
      } finally {
        manualPrBtn.textContent = originalText;
        manualPrBtn.disabled = false;
      }
    };

    manualPrBtn.addEventListener('click', handleAnalyze);
    manualPrInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAnalyze();
    });
  }

  // --- GitHub Connect Modal Check ---
  const isGithubConnected = localStorage.getItem('isGithubConnected');
  if (isGithubConnected !== 'true') {
    const modal = document.getElementById('github-connect-modal');
    if (modal) {
      modal.style.display = 'block';
      
      const btnClose = document.getElementById('btn-close-github-modal');
      const btnConnect = document.getElementById('btn-connect-github-modal');
      
      if (btnClose) {
        btnClose.addEventListener('click', () => {
          modal.style.display = 'none';
        });
      }
      
      if (btnConnect) {
        btnConnect.addEventListener('click', () => {
          btnConnect.textContent = 'Connecting...';
          
          const ghClientId = 'Ov23liarYizusohYEor6';
          const ghScope = encodeURIComponent('read:user user:email repo');
          // No redirect_uri — uses registered default from GitHub OAuth App settings
          const ghUrl = `https://github.com/login/oauth/authorize?client_id=${ghClientId}&scope=${ghScope}`;
          const popup = window.open(ghUrl, 'GitHubAuth', 'width=600,height=700,left=400,top=100');
          
          const checkClosed = setInterval(() => {
             if (!popup || popup.closed) {
               clearInterval(checkClosed);
               localStorage.setItem('isGithubConnected', 'true');
               modal.style.display = 'none';
               alert('GitHub Connected Successfully!');
             }
          }, 500);
        });
      }
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
