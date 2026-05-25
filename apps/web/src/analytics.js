import './analytics.css';
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

  // Mobile menu items hover/active toggle
  const navMenuItems = document.querySelectorAll('.nav-menu-item');
  navMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      navMenuItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ─────────────────────────────────────────────
  // 2. Dropdown Menus (Repo Switcher, Notifications, Profile)
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

  // Handle repo options selector
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
  // 3. Repository Health Analytics Tabs & Hover Tooltips
  // ─────────────────────────────────────────────
  const tabs = document.querySelectorAll('#health-chart-tabs .an-tab-btn');
  const svgs = document.querySelectorAll('#an-health-chart-viewport .an-observability-svg');
  const tooltip = document.getElementById('health-chart-tooltip');
  const legendText = document.querySelector('.an-chart-legends');

  // Map of tab names to legends for visual detailing
  const tabLegendsMap = {
    quality: '<div class="legend-item"><span class="legend-dot bg-rose"></span> Code Quality Score</div><div class="legend-item"><span class="legend-dot bg-blue"></span> Review Accuracy (Target Baseline)</div>',
    deployments: '<div class="legend-item"><span class="legend-dot bg-green"></span> Deployment Success Rate</div><div class="legend-item"><span class="legend-dot bg-purple"></span> Merge Stability Index</div>',
    productivity: '<div class="legend-item"><span class="legend-dot bg-blue"></span> PR Velocity Hours</div><div class="legend-item"><span class="legend-dot bg-rose"></span> Review Turnaround Time (avg)</div>',
    debt: '<div class="legend-item"><span class="legend-dot bg-amber"></span> Technical Debt Growth</div><div class="legend-item"><span class="legend-dot bg-red"></span> Regression & Bug Probability</div>'
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle button states
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Toggle Chart viewports
      const chartKey = tab.dataset.chart;
      svgs.forEach(svg => {
        svg.classList.remove('active');
        if (svg.id === `chart-${chartKey}-svg`) {
          svg.classList.add('active');
        }
      });

      // Update legends
      if (legendText && tabLegendsMap[chartKey]) {
        legendText.innerHTML = tabLegendsMap[chartKey];
      }

      // Hide active tooltip
      if (tooltip) tooltip.style.opacity = 0;
    });
  });

  // Chart hover interactivity setup
  const chartContainers = document.querySelectorAll('.an-chart-container');
  chartContainers.forEach(container => {
    container.addEventListener('mousemove', (e) => {
      const activeSvg = container.querySelector('.an-observability-svg.active');
      if (!activeSvg || !tooltip) return;

      // Find closest node trigger if hovering over points
      const targetNode = e.target.closest('.node-hover-trigger');
      if (targetNode) {
        const dateVal = targetNode.getAttribute('data-date');
        const metricVal1 = targetNode.getAttribute('data-val1');
        const metricVal2 = targetNode.getAttribute('data-val2');

        const activeTabKey = document.querySelector('#health-chart-tabs .an-tab-btn.active').dataset.chart;
        let metricLabels = ['Code Quality', 'Review Accuracy'];
        let colorClasses = ['bg-rose', 'bg-blue'];

        if (activeTabKey === 'deployments') {
          metricLabels = ['Deploy Success', 'Merge Stability'];
          colorClasses = ['bg-green', 'bg-purple'];
        } else if (activeTabKey === 'productivity') {
          metricLabels = ['PR Velocity', 'Turnaround Time'];
          colorClasses = ['bg-blue', 'bg-rose'];
        } else if (activeTabKey === 'debt') {
          metricLabels = ['Tech Debt Factor', 'Bug Probability'];
          colorClasses = ['bg-amber', 'bg-red'];
        }

        tooltip.querySelector('.tooltip-date').textContent = dateVal;
        tooltip.querySelector('.tooltip-values').innerHTML = `
          <div class="tooltip-val"><span class="tooltip-dot ${colorClasses[0]}"></span> ${metricLabels[0]}: <strong>${metricVal1 || '92%'}</strong></div>
          <div class="tooltip-val"><span class="tooltip-dot ${colorClasses[1]}"></span> ${metricLabels[1]}: <strong>${metricVal2 || '94%'}</strong></div>
        `;

        // Coordinate positioning
        const rect = container.getBoundingClientRect();
        const tooltipX = e.clientX - rect.left + 15;
        const tooltipY = e.clientY - rect.top - 60;

        tooltip.style.left = `${tooltipX}px`;
        tooltip.style.top = `${tooltipY}px`;
        tooltip.style.opacity = 1;
        tooltip.style.transform = 'translateY(0px)';
      }
    });

    container.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.style.opacity = 0;
        tooltip.style.transform = 'translateY(5px)';
      }
    });
  });

  // ─────────────────────────────────────────────
  // 4. Interactive Architecture Dependency Graph
  // ─────────────────────────────────────────────
  const nodes = document.querySelectorAll('.graph-node-group');
  const detailsPanel = document.getElementById('dynamic-node-info');
  const infoTitle = document.getElementById('node-info-title');
  const infoDesc = document.getElementById('node-info-desc');
  const edges = document.querySelectorAll('.graph-edge');

  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const service = node.dataset.service;
      const desc = node.dataset.desc;
      
      // Update details card
      if (detailsPanel && infoTitle && infoDesc) {
        detailsPanel.classList.add('active-node');
        infoTitle.textContent = `${service.toUpperCase()} SERVICE PROFILE`;
        infoDesc.textContent = desc;

        // Custom accent color class based on service
        infoTitle.className = '';
        if (service === 'api') infoTitle.classList.add('text-blue');
        else if (service === 'billing') infoTitle.classList.add('text-rose');
        else if (service === 'auth') infoTitle.classList.add('text-purple');
        else if (service === 'db') infoTitle.classList.add('text-cyan');
        else if (service === 'stripe') infoTitle.classList.add('text-green');
        else infoTitle.classList.add('text-amber');
      }

      // Highlight edges starting or ending at this node
      edges.forEach(edge => {
        edge.classList.remove('highlighted');
        if (edge.className.baseVal.includes(`edge-${service}`) || edge.className.baseVal.includes(`-${service}`)) {
          edge.classList.add('highlighted');
        }
      });
    });

    node.addEventListener('mouseleave', () => {
      if (detailsPanel) {
        detailsPanel.classList.remove('active-node');
      }
      edges.forEach(edge => {
        edge.classList.remove('highlighted');
      });
    });
  });

  // ─────────────────────────────────────────────
  // 5. Live Activity Telemetry Terminal Stream
  // ─────────────────────────────────────────────
  const telemetryBody = document.getElementById('an-telemetry-body');
  const activeLine = document.getElementById('active-terminal-telemetry-line');

  const incomingTelemetryLogs = [
    { text: '[scanner] Checking structural index maps inside /apps/api...', type: 'info' },
    { text: '[review] Auto-generated patch suggestions for cookie session safety', type: 'info' },
    { text: '[benchmark] Standards validated: naming conventions scored 96% ✓', type: 'info' },
    { text: '[webhook] Received push event branch=patch-release commit_id=d831a2', type: 'info' },
    { text: '[risk-analysis] Re-evaluating rollback metrics... Safety rating rises to 90%', type: 'ok' },
    { text: '[architecture] Warning: circular import detected onpackages/billing ↔ api', type: 'warn' },
    { text: '[scanner] Complete: Indexed 42 files. Zero vulnerability gaps reported ✓', type: 'ok' }
  ];

  let telemetryIndex = 0;

  const pushNextTelemetryLog = () => {
    if (!telemetryBody || !activeLine) return;
    if (telemetryIndex >= incomingTelemetryLogs.length) {
      telemetryIndex = 0; // Loop logs
    }

    const log = incomingTelemetryLogs[telemetryIndex];
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    // Replace active spinner line
    activeLine.classList.remove('line-active');
    activeLine.removeAttribute('id');
    const spinner = activeLine.querySelector('.term-spinner');
    if (spinner) {
      spinner.textContent = '✓';
      spinner.className = 'log-check';
    }

    // Append new line
    const newLine = document.createElement('div');
    newLine.id = 'active-terminal-telemetry-line';
    
    let lineClass = 'info-line';
    if (log.type === 'warn') lineClass = 'warn-line';
    else if (log.type === 'critical') lineClass = 'critical-line';

    newLine.className = `term-log-line line-active ${lineClass}`;
    newLine.innerHTML = `
      <span class="log-time">[${timestamp}]</span>
      <span class="log-pre">▸</span> ${log.text} <span class="term-spinner">⠋</span>
    `;

    telemetryBody.appendChild(newLine);
    telemetryBody.scrollTop = telemetryBody.scrollHeight;

    // Track state
    telemetryIndex++;
    
    // Setup timer for next push
    setTimeout(pushNextTelemetryLog, 4000 + Math.random() * 3000);
  };

  // Spinning loop character set
  const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let spinIdx = 0;
  setInterval(() => {
    const activeSpinners = document.querySelectorAll('.term-spinner');
    activeSpinners.forEach(s => {
      s.textContent = spinnerChars[spinIdx];
    });
    spinIdx = (spinIdx + 1) % spinnerChars.length;
  }, 100);

  // Start telemetry loop after 3s
  setTimeout(pushNextTelemetryLog, 3000);

  // ─────────────────────────────────────────────
  // 6. Floating AI Assistant Chat panel
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

  // Floating AI interactive buttons
  const couplingBtn = document.getElementById('floating-review-coupling');
  const concurrencyBtn = document.getElementById('floating-fix-concurrency');

  if (couplingBtn) {
    couplingBtn.addEventListener('click', () => {
      alert("AI Coupling Analysis Triggered: Running compiler dependency audits on 'RoseReview-AI'...");
    });
  }

  if (concurrencyBtn) {
    concurrencyBtn.addEventListener('click', () => {
      alert("Generating Concurrency Patch: Suggesting PGClient transaction lock hooks for apps/api/src/billing.ts...");
    });
  }

  // ─────────────────────────────────────────────
  // 7. Minor Live Oscillations (Realism & Telemetry)
  // ─────────────────────────────────────────────
  setInterval(() => {
    // 1. Health Score variation (+/- 1 score)
    const healthCounter = document.getElementById('counter-health');
    if (healthCounter) {
      let currentVal = parseInt(healthCounter.textContent, 10);
      const delta = Math.random() > 0.6 ? 1 : -1;
      let newVal = Math.min(Math.max(currentVal + delta, 92), 95);
      healthCounter.textContent = newVal;
    }

    // 2. Deploy Confidence variation (+/- 1%)
    const deployCounter = document.getElementById('counter-deploy');
    if (deployCounter) {
      let currentVal = parseInt(deployCounter.textContent, 10);
      const delta = Math.random() > 0.5 ? 1 : -1;
      let newVal = Math.min(Math.max(currentVal + delta, 88), 90);
      deployCounter.textContent = newVal;

      // Update Gauge dasharray matching newVal
      const gaugeFill = document.getElementById('gauge-risk-fill');
      if (gaugeFill) {
        // dasharray total = 126
        const length = Math.round((newVal / 100) * 126);
        gaugeFill.setAttribute('stroke-dasharray', `${length} 126`);
      }
    }

    // 3. Rollback Probability oscillation
    const riskNum = document.getElementById('risk-val-number');
    if (riskNum) {
      let currentVal = parseInt(riskNum.textContent.replace('%', ''), 10);
      const delta = Math.random() > 0.5 ? 1 : -1;
      let newVal = Math.min(Math.max(currentVal + delta, 11), 14);
      riskNum.textContent = `${newVal}%`;
    }
  }, 7000);
});
