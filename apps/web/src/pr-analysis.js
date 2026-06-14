import './pr-analysis.css';
import './responsive.js';
import { enforceAuth, handleSignOut } from './auth-guard.js';

enforceAuth();

document.addEventListener('DOMContentLoaded', () => {
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

  // ─────────────────────────────────────────────
  // 2. Floating AI Assistant Widget
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
  // 3. Apply Patch Simulation Logic
  // ─────────────────────────────────────────────
  const btnApplyPatch = document.getElementById('btn-apply-patch');
  const btnFloatingApplyPatch = document.getElementById('floating-apply-patch');
  const toast = document.getElementById('patch-success-toast');

  // Elements to update after patch applied
  const proposedCodeLines = document.querySelector('.column-proposed .code-editor-lines');
  const mergeReadinessNum = document.querySelector('.pr-header-stats .pr-stat-box:nth-child(2) .stat-val');
  const totalFindingsNum = document.querySelector('.pr-analytics-overview .overview-card:nth-child(1) .card-num');
  const criticalNum = document.querySelector('.pr-analytics-overview .overview-card:nth-child(2) .card-num');
  const conflictNum = document.querySelector('.pr-analytics-overview .overview-card:nth-child(4) .card-num');
  const inlineComment = document.querySelector('.inline-comment-wrapper');
  const prBadgeStatus = document.querySelector('.pr-header-badge-status');

  const executeApplyPatch = () => {
    // 1. Live update the code lines inside Proposed Code column
    if (proposedCodeLines) {
      proposedCodeLines.style.opacity = '0';
      proposedCodeLines.style.transform = 'translateY(5px)';
      proposedCodeLines.style.transition = 'all 0.3s ease';

      setTimeout(() => {
        proposedCodeLines.innerHTML = `
          <div class="editor-line"><span class="line-no">59</span>  async function processPayment(amount: number) {</div>
          <div class="editor-line"><span class="line-no">60</span>    const db = await getDbConnection();</div>
          <div class="editor-line line-added"><span class="line-no">61</span>    // AI Added concurrency transaction locking boundary</div>
          <div class="editor-line line-added"><span class="line-no">62</span>    const account = await db.account.findUniqueWithLock({ id });</div>
          <div class="editor-line line-added"><span class="line-no">63</span>    if (account.transactionPending) throw new ConcurrentTransactionError();</div>
          <div class="editor-line line-added"><span class="line-no">64</span>    await processChargeWithTransactionLock(account, amount);</div>
          <div class="editor-line"><span class="line-no">65</span>    return { success: true };</div>
          <div class="editor-line"><span class="line-no">66</span>  }</div>
        `;
        proposedCodeLines.style.opacity = '1';
        proposedCodeLines.style.transform = 'translateY(0)';
      }, 300);
    }

    // 2. Animate and update metrics
    if (mergeReadinessNum) {
      animateValue(mergeReadinessNum, 78, 96, 1500, '%');
    }
    if (totalFindingsNum) {
      animateValue(totalFindingsNum, 3, 2, 1000, ' findings');
    }
    if (criticalNum) {
      animateValue(criticalNum, 1, 0, 1000);
      const criticalCard = criticalNum.closest('.overview-card');
      if (criticalCard) {
        criticalCard.classList.remove('card--critical');
        const sub = criticalCard.querySelector('.card-sub');
        if (sub) {
          sub.textContent = 'All Clear';
          sub.className = 'card-sub text-green font-weight-bold';
        }
      }
    }
    if (conflictNum) {
      animateValue(conflictNum, 90, 15, 1500, '%');
      const conflictCard = conflictNum.closest('.overview-card');
      if (conflictCard) {
        const sub = conflictCard.querySelector('.card-sub');
        if (sub) {
          sub.textContent = 'Low Collision';
          sub.className = 'card-sub text-green font-weight-bold';
        }
      }
    }

    // 3. Update status badges
    if (prBadgeStatus) {
      prBadgeStatus.textContent = 'Ready';
      prBadgeStatus.className = 'pr-header-badge-status text-green';
      prBadgeStatus.style.background = 'rgba(34, 197, 94, 0.1)';
      prBadgeStatus.style.border = '1px solid rgba(34, 197, 94, 0.2)';
    }

    // 4. Hide critical comment alert with a smooth height transition
    if (inlineComment) {
      inlineComment.style.maxHeight = `${inlineComment.scrollHeight}px`;
      inlineComment.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      inlineComment.style.opacity = '1';
      requestAnimationFrame(() => {
        inlineComment.style.maxHeight = '0';
        inlineComment.style.paddingTop = '0';
        inlineComment.style.paddingBottom = '0';
        inlineComment.style.marginTop = '0';
        inlineComment.style.borderWidth = '0';
        inlineComment.style.opacity = '0';
        inlineComment.style.overflow = 'hidden';
      });
    }

    // 5. Show toast alert
    if (toast) {
      toast.classList.add('visible');
      setTimeout(() => {
        toast.classList.remove('visible');
      }, 4000);
    }

    // 6. Disable buttons and change labels
    [btnApplyPatch, btnFloatingApplyPatch].forEach(btn => {
      if (btn) {
        btn.textContent = 'Patch Applied ✓';
        btn.disabled = true;
        btn.style.background = 'var(--accent-green)';
        btn.style.boxShadow = 'none';
      }
    });

    // Close AI floating card if open
    if (aiCard) {
      aiCard.classList.remove('open');
    }
  };

  if (btnApplyPatch) btnApplyPatch.addEventListener('click', executeApplyPatch);
  if (btnFloatingApplyPatch) btnFloatingApplyPatch.addEventListener('click', executeApplyPatch);

  // Helper function to animate values
  function animateValue(obj, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(ease * (end - start) + start);
      obj.textContent = `${val}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // ─────────────────────────────────────────────
  // 4. Observability Gauges & Path Oscillations
  // ─────────────────────────────────────────────
  // Subtle animation loops on the SVG charts
  setInterval(() => {
    const devopsGaugeNum = document.querySelector('.devops-gauge-num');
    if (devopsGaugeNum) {
      let val = parseInt(devopsGaugeNum.textContent, 10);
      const delta = Math.random() > 0.5 ? 1 : -1;
      let newVal = Math.min(Math.max(val + delta, 10), 16);
      devopsGaugeNum.textContent = `${newVal}%`;

      const gaugeFill = document.querySelector('.devops-gauge-wrap .gauge-fill-anim');
      if (gaugeFill) {
        // total length is 126
        const length = Math.round((newVal / 100) * 126);
        gaugeFill.setAttribute('stroke-dasharray', `${length} 126`);
      }
    }
  }, 5000);
});
