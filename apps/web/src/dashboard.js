import './dashboard.css';
import './responsive.js';

document.addEventListener('DOMContentLoaded', () => {
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
});
