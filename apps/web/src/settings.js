import './settings.css';
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

  // ─────────────────────────────────────────────
  // 2. Settings Nav Scrollspy & Click Highlighting
  // ─────────────────────────────────────────────
  const navItems = document.querySelectorAll('.se-nav-item');
  const panels = document.querySelectorAll('.se-section-panel');
  const scrollContainer = document.querySelector('.dash-scroll-view');

  // Handle active states on manual navigation click
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href');
      const targetPanel = document.querySelector(targetId);

      if (targetPanel && scrollContainer) {
        // Smooth scroll to panel offset
        scrollContainer.scrollTo({
          top: targetPanel.offsetTop - 88,
          behavior: 'smooth'
        });

        // Set active link
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  // Scrollspy logic to auto-activate nav items as panels scroll into viewport
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', () => {
      let currentSectionId = '';
      
      panels.forEach(panel => {
        const panelTop = panel.offsetTop - 120;
        if (scrollContainer.scrollTop >= panelTop) {
          currentSectionId = `#${panel.id}`;
        }
      });

      if (currentSectionId) {
        navItems.forEach(item => {
          if (item.getAttribute('href') === currentSectionId) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }

  // ─────────────────────────────────────────────
  // 3. AI Strictness, Empathy and Verbosity Sliders
  // ─────────────────────────────────────────────
  const sliderStrictness = document.getElementById('slider-strictness');
  const valStrictness = document.getElementById('val-strictness');
  const sliderEmpathy = document.getElementById('slider-empathy');
  const valEmpathy = document.getElementById('val-empathy');
  const sliderVerbosity = document.getElementById('slider-verbosity');
  const valVerbosity = document.getElementById('val-verbosity');

  const toneCommentText = document.getElementById('tone-comment-text');

  // Comment styles map depending on strictness & empathy levels
  const commentsDatabase = {
    strictness: {
      low: "“Stylistic review clean. Formatting patterns look normal.”",
      medium: "“This billing transaction logic is clean, though concurrent calls might trigger a race condition hazard. Consider wrapping the query block in findUniqueWithLock.”",
      high: "“CRITICAL logic race hazard detected. Rapid concurrent checkout requests bypass balance checks. Wrap apps/api/src/billing.ts in a database write-lock boundary immediately!”"
    },
    empathy: [
      "“CRITICAL: apps/api/billing.ts allows concurrent double checkout race conditions. Insert findUniqueWithLock. Throw ConcurrentTransactionError. Fix now.”", // Severe
      "“This billing transaction logic is clean, though concurrent calls might trigger a race condition hazard. Consider wrapping the query block in findUniqueWithLock.”", // Collaborative
      "“Your transaction handler is clean and easy to follow. To ensure maximum reliability under high traffic, I'd suggest implementing a database lock boundary. This prevents concurrent requests from double charging accounts. Keep up the great work!”" // Mentorship
    ]
  };

  const updateAIReviewPreview = () => {
    if (!toneCommentText) return;

    const strictVal = parseInt(sliderStrictness.value, 10);
    const empathyVal = parseInt(sliderEmpathy.value, 10); // 1, 2, or 3

    // Update strictness label
    if (valStrictness) {
      valStrictness.textContent = `${strictVal}%`;
    }

    // Update empathy label
    const empathyLabels = ['Direct / Severe', 'Collaborative', 'Mentorship'];
    if (valEmpathy) {
      valEmpathy.textContent = empathyLabels[empathyVal - 1];
    }

    // Determine comment content: empathy overrides direct tone when empathy slider shifts, else use strictness levels
    if (empathyVal === 1) {
      toneCommentText.textContent = commentsDatabase.empathy[0];
    } else if (empathyVal === 3) {
      toneCommentText.textContent = commentsDatabase.empathy[2];
    } else {
      // Use strictness divisions for level 2 collaborative tone
      if (strictVal < 40) {
        toneCommentText.textContent = commentsDatabase.strictness.low;
      } else if (strictVal > 75) {
        toneCommentText.textContent = commentsDatabase.strictness.high;
      } else {
        toneCommentText.textContent = commentsDatabase.strictness.medium;
      }
    }
  };

  if (sliderStrictness) {
    sliderStrictness.addEventListener('input', updateAIReviewPreview);
  }

  if (sliderEmpathy) {
    sliderEmpathy.addEventListener('input', updateAIReviewPreview);
  }

  if (sliderVerbosity) {
    sliderVerbosity.addEventListener('input', () => {
      const verbVal = parseInt(sliderVerbosity.value, 10);
      let verbText = 'Standard';
      if (verbVal < 35) verbText = 'Compact';
      else if (verbVal > 75) verbText = 'Exhaustive';
      
      if (valVerbosity) {
        valVerbosity.textContent = `${verbText} (${verbVal}%)`;
      }
    });
  }

  // ─────────────────────────────────────────────
  // 4. Live Benchmark Compliance Calculator
  // ─────────────────────────────────────────────
  const toggleCoverage = document.getElementById('toggle-rule-coverage');
  const toggleCoupling = document.getElementById('toggle-rule-coupling');
  const inputCoverage = document.getElementById('input-rule-coverage');
  const previewCompliance = document.getElementById('preview-compliance-score');
  const previewAffected = document.getElementById('preview-affected-prs');

  const recalculateCompliancePreview = () => {
    if (!previewCompliance || !previewAffected) return;

    let score = 88;
    let prs = 2;

    const coverageActive = toggleCoverage ? toggleCoverage.checked : false;
    const couplingActive = toggleCoupling ? toggleCoupling.checked : false;
    const coverageVal = inputCoverage ? parseInt(inputCoverage.value, 10) : 80;

    // Shift scores dynamically based on sliders/toggles
    if (!coverageActive) {
      score -= 15;
      prs -= 1;
    } else {
      if (coverageVal > 85) {
        score += 6;
        prs += 1; // Strict tests flag more PRs
      } else if (coverageVal < 70) {
        score -= 8;
      }
    }

    if (!couplingActive) {
      score -= 22;
    } else {
      score += 6;
    }

    // Bind boundary
    score = Math.min(Math.max(score, 45), 98);
    prs = Math.max(prs, 0);

    previewCompliance.textContent = `${score}/100`;
    previewAffected.textContent = `${prs} Open`;

    const statusChart = document.querySelector('.preview-chart-val');
    if (statusChart) {
      if (score >= 85) {
        statusChart.textContent = '✓ Minimal Incident Chance';
        statusChart.className = 'preview-chart-val text-green font-weight-bold';
      } else if (score >= 70) {
        statusChart.textContent = '◌ Moderate Incident Risk';
        statusChart.className = 'preview-chart-val text-amber font-weight-bold';
      } else {
        statusChart.textContent = '⚠ High Deployment Incident Danger';
        statusChart.className = 'preview-chart-val text-red font-weight-bold';
      }
    }
  };

  [toggleCoverage, toggleCoupling].forEach(toggle => {
    if (toggle) toggle.addEventListener('change', recalculateCompliancePreview);
  });

  if (inputCoverage) {
    inputCoverage.addEventListener('input', recalculateCompliancePreview);
  }

  // ─────────────────────────────────────────────
  // 5. Team Member Invitation Modal Simulation
  // ─────────────────────────────────────────────
  const inviteBtn = document.getElementById('btn-invite-member');
  if (inviteBtn) {
    inviteBtn.addEventListener('click', () => {
      const email = prompt("Enter the developer email to invite to 'Acme Dev Corp' workspace:");
      if (email) {
        alert(`Invitation sent successfully to ${email}! They will receive access authorization codes via email.`);
      }
    });
  }

  // ─────────────────────────────────────────────
  // 6. Security API Token Reveal & Copy Actions
  // ─────────────────────────────────────────────
  const revealBtn = document.getElementById('btn-reveal-token');
  const copyBtn = document.getElementById('btn-copy-token');
  const tokenInput = document.getElementById('api-token-field');
  const copiedToast = document.getElementById('token-copied-toast');

  if (revealBtn && tokenInput) {
    revealBtn.addEventListener('click', () => {
      if (tokenInput.type === 'password') {
        tokenInput.type = 'text';
        revealBtn.textContent = 'Hide';
      } else {
        tokenInput.type = 'password';
        revealBtn.textContent = 'Reveal';
      }
    });
  }

  if (copyBtn && tokenInput) {
    copyBtn.addEventListener('click', () => {
      // Select & Copy
      tokenInput.select();
      tokenInput.setSelectionRange(0, 99999); // Mobile
      navigator.clipboard.writeText(tokenInput.value)
        .then(() => {
          if (copiedToast) {
            copiedToast.style.opacity = 1;
            setTimeout(() => {
              copiedToast.style.opacity = 0;
            }, 2000);
          }
        })
        .catch(() => {
          alert("Failed to copy. Please manually select the field and copy.");
        });
    });
  }

  // ─────────────────────────────────────────────
  // 7. Workspace Personalization Custom Themes & Layouts
  // ─────────────────────────────────────────────
  const compactToggler = document.getElementById('toggle-compact-mode');
  if (compactToggler) {
    compactToggler.addEventListener('change', () => {
      if (compactToggler.checked) {
        document.body.classList.add('compact-mode');
      } else {
        document.body.classList.remove('compact-mode');
      }
    });
  }

  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active preset
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedTheme = btn.dataset.theme;
      // Remove all theme classes on body
      document.body.classList.remove('theme-dark', 'theme-ambient', 'theme-terminal');
      
      // Add matching theme class
      document.body.classList.add(`theme-${selectedTheme}`);

      // Optional feedback details
      console.log(`RoseReview Workspace Theme set to: ${selectedTheme}`);
    });
  });

  // ─────────────────────────────────────────────
  // 8. Notification Intelligence Toggle Updates
  // ─────────────────────────────────────────────
  const criticalToggle = document.getElementById('notif-critical');
  const mergesToggle = document.getElementById('notif-merges');
  const previewTitle = document.getElementById('notif-preview-title');
  const previewDesc = document.getElementById('notif-preview-desc');
  const notifBox = document.getElementById('notif-preview-box');

  const updateNotificationPreview = () => {
    if (!previewTitle || !previewDesc || !notifBox) return;

    const criticalOn = criticalToggle ? criticalToggle.checked : false;
    const mergesOn = mergesToggle ? mergesToggle.checked : false;

    if (!criticalOn && !mergesOn) {
      notifBox.style.display = 'none';
    } else {
      notifBox.style.display = 'block';
      if (criticalOn) {
        previewTitle.textContent = "Critical Logic Alert";
        previewDesc.textContent = "Security verification bypassed on billing.ts. Syncing patch suggests.";
      } else if (mergesOn) {
        previewTitle.textContent = "Merge Instability Risk";
        previewDesc.textContent = "High collision path forecasted on refs/heads/main. 90% overlap conflict.";
      }
    }
  };

  [criticalToggle, mergesToggle].forEach(ch => {
    if (ch) ch.addEventListener('change', updateNotificationPreview);
  });

  // --- GitHub Connection Status Check ---
  const checkGithubStatus = () => {
    const isGithubConnected = localStorage.getItem('isGithubConnected') === 'true';
    const badge = document.getElementById('gh-status-badge');
    const pulse = document.getElementById('gh-pulse');
    const statusText = document.getElementById('gh-status-text');
    const metaConnected = document.getElementById('gh-metadata-connected');
    const metaDisconnected = document.getElementById('gh-metadata-disconnected');

    if (badge && metaConnected && metaDisconnected) {
      if (isGithubConnected) {
        badge.classList.add('badge-active');
        badge.style.background = '';
        badge.style.color = '';
        if (pulse) pulse.style.display = 'inline-block';
        if (statusText) statusText.textContent = 'Active Sync';
        metaConnected.style.display = 'flex';
        metaDisconnected.style.display = 'none';
      } else {
        badge.classList.remove('badge-active');
        badge.style.background = 'rgba(255, 255, 255, 0.1)';
        badge.style.color = 'var(--text-secondary)';
        if (pulse) pulse.style.display = 'none';
        if (statusText) statusText.textContent = 'Not Connected';
        metaConnected.style.display = 'none';
        metaDisconnected.style.display = 'flex';
      }
    }
  };

  checkGithubStatus();

  const btnSettingsConnectGh = document.getElementById('btn-settings-connect-github');
  if (btnSettingsConnectGh) {
    btnSettingsConnectGh.addEventListener('click', () => {
      btnSettingsConnectGh.textContent = 'Connecting...';
      
      const ghClientId = 'Ov23liarYizusohYEor6';
      const ghScope = encodeURIComponent('read:user user:email repo');
      // No redirect_uri — uses registered default from GitHub OAuth App settings
      const ghUrl = `https://github.com/login/oauth/authorize?client_id=${ghClientId}&scope=${ghScope}`;
      const popup = window.open(ghUrl, 'GitHubAuth', 'width=600,height=700,left=400,top=100');
      
      const checkClosed = setInterval(() => {
         if (!popup || popup.closed) {
           clearInterval(checkClosed);
           localStorage.setItem('isGithubConnected', 'true');
           checkGithubStatus();
           alert('GitHub Connected Successfully!');
         }
      }, 500);
    });
  }
});
