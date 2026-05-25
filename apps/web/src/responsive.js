/* ============================================================
   RoseReview — Responsive Layout & Adaptive UX Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const isDashboard = document.body.classList.contains('dash-layout-body');
  
  if (isDashboard) {
    initResponsiveSystem();
  }
});

function initResponsiveSystem() {
  const isMobileViewport = () => window.innerWidth <= 768;

  // 1. Dynamic Mobile Navigation Injection
  injectMobileBottomNav();

  // 2. Prepend Mobile Header branding when sidebar is hidden
  injectMobileHeaderBranding();

  // 3. Initialize Monaco Code Diff Mobile Toggler
  initCodeDiffToggler();

  // 4. Setup Swipe Gestures for Mobile AI Assistant bottom drawer
  initMobileAIDrawer();

  // 5. Setup Swipe-to-Dismiss on alerts and notifications
  initSwipeDismissNotifications();

  // 6. Handle bottom nav show/hide on scroll (improves reading viewports)
  initScrollBehavior();

  // Recheck on window resize (e.g. tablet rotating)
  window.addEventListener('resize', debounce(() => {
    injectMobileBottomNav();
    injectMobileHeaderBranding();
    initCodeDiffToggler();
  }, 150));
}

// ────────────────────────────────────────────────────────────
// 1. Injects the glassmorphic bottom nav menu on mobile
// ────────────────────────────────────────────────────────────
function injectMobileBottomNav() {
  if (window.innerWidth > 768) {
    const existingNav = document.querySelector('.mobile-bottom-nav');
    if (existingNav) existingNav.remove();
    return;
  }

  if (document.querySelector('.mobile-bottom-nav')) {
    highlightActiveTab();
    return;
  }

  const navHtml = `
    <div class="mobile-bottom-nav">
      <a href="/dashboard.html" class="mobile-nav-item" data-tab="dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        <span>Dashboard</span>
      </a>
      <a href="/pr-analysis.html" class="mobile-nav-item" data-tab="prs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-6a2 2 0 00-2-2H4"/><circle cx="6" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><path d="M6 8v8a2 2 0 002 2h8"/></svg>
        <span>PRs</span>
      </a>
      <a href="/dashboard.html#risk-analysis" class="mobile-nav-item" data-tab="risk">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>Risk Center</span>
      </a>
      <a href="/analytics.html" class="mobile-nav-item" data-tab="analytics">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
        <span>Insights</span>
      </a>
      <a href="#" class="mobile-nav-item" data-tab="notifications" id="mobile-notif-trigger">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        <span>Alerts</span>
      </a>
      <a href="/settings.html" class="mobile-nav-item" data-tab="settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83-2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        <span>Settings</span>
      </a>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', navHtml);
  highlightActiveTab();

  // Attach notifications click behavior to mobile trigger
  const mobileNotif = document.getElementById('mobile-notif-trigger');
  const desktopNotifDropdown = document.getElementById('notification-dropdown');
  if (mobileNotif && desktopNotifDropdown) {
    mobileNotif.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = desktopNotifDropdown.classList.contains('open');
      if (isOpen) {
        desktopNotifDropdown.classList.remove('open');
        highlightActiveTab();
      } else {
        // Close others
        const repoDropdown = document.getElementById('repo-dropdown');
        const profileDropdown = document.getElementById('profile-dropdown');
        if (repoDropdown) repoDropdown.classList.remove('open');
        if (profileDropdown) profileDropdown.classList.remove('open');
        
        desktopNotifDropdown.classList.add('open');
        document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
        mobileNotif.classList.add('active');
      }
    });
  }
}

function highlightActiveTab() {
  const path = window.location.pathname;
  const hash = window.location.hash;
  const navItems = document.querySelectorAll('.mobile-nav-item');
  
  navItems.forEach(item => item.classList.remove('active'));

  if (hash.includes('risk-analysis')) {
    const el = document.querySelector('.mobile-nav-item[data-tab="risk"]');
    if (el) el.classList.add('active');
  } else if (path.includes('dashboard') || path === '/' || path.endsWith('web/')) {
    const el = document.querySelector('.mobile-nav-item[data-tab="dashboard"]');
    if (el) el.classList.add('active');
  } else if (path.includes('pr-analysis')) {
    const el = document.querySelector('.mobile-nav-item[data-tab="prs"]');
    if (el) el.classList.add('active');
  } else if (path.includes('analytics')) {
    const el = document.querySelector('.mobile-nav-item[data-tab="analytics"]');
    if (el) el.classList.add('active');
  } else if (path.includes('settings')) {
    const el = document.querySelector('.mobile-nav-item[data-tab="settings"]');
    if (el) el.classList.add('active');
  }
}

// ────────────────────────────────────────────────────────────
// 2. Prepends branding logo to header when sidebar is hidden
// ────────────────────────────────────────────────────────────
function injectMobileHeaderBranding() {
  if (window.innerWidth > 768) {
    const logo = document.querySelector('.mobile-header-logo');
    if (logo) logo.remove();
    return;
  }

  const headerLeft = document.querySelector('.dash-header .header-left');
  if (headerLeft && !document.querySelector('.mobile-header-logo')) {
    const logoHtml = `
      <a href="/" class="mobile-header-logo" style="margin-right: 8px; display: flex; align-items: center;">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2C7.37 2 2 7.37 2 14c0 4.1 2.06 7.72 5.21 9.87L14 16.66l6.79 7.21C23.94 21.72 26 18.1 26 14c0-6.63-5.37-12-12-12z" fill="url(#mRoseGrad)"/>
          <defs>
            <linearGradient id="mRoseGrad" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
              <stop stop-color="#f43f5e"/>
              <stop stop-color="#8b5cf6"/>
            </linearGradient>
          </defs>
        </svg>
      </a>
    `;
    headerLeft.insertAdjacentHTML('afterbegin', logoHtml);
  }
}

// ────────────────────────────────────────────────────────────
// 3. Mobile Code Diff Switcher Programmatic Tabs & Swiping
// ────────────────────────────────────────────────────────────
function initCodeDiffToggler() {
  const diffViewers = document.querySelectorAll('.code-diff-viewer');
  
  diffViewers.forEach(viewer => {
    if (window.innerWidth > 768) {
      // Remove mobile selectors if desktop view is active
      const switcher = viewer.querySelector('.mobile-diff-switcher');
      if (switcher) switcher.remove();
      
      const colOrig = viewer.querySelector('.column-original');
      const colProp = viewer.querySelector('.column-proposed');
      if (colOrig) colOrig.classList.remove('mobile-visible');
      if (colProp) colProp.classList.remove('mobile-visible');
      return;
    }

    // Check if switcher exists, if not, construct it
    if (viewer.querySelector('.mobile-diff-switcher')) return;

    const colOrig = viewer.querySelector('.column-original');
    const colProp = viewer.querySelector('.column-proposed');

    if (!colOrig || !colProp) return;

    // Set initial display configuration
    colOrig.classList.add('mobile-visible');
    colProp.classList.remove('mobile-visible');

    const switcherHtml = `
      <div class="mobile-diff-switcher">
        <button class="diff-switch-btn active" data-side="original">Original Code</button>
        <button class="diff-switch-btn" data-side="proposed">Proposed Code</button>
      </div>
    `;
    viewer.insertAdjacentHTML('afterbegin', switcherHtml);

    const buttons = viewer.querySelectorAll('.diff-switch-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetSide = btn.getAttribute('data-side');
        if (targetSide === 'original') {
          colOrig.classList.add('mobile-visible');
          colProp.classList.remove('mobile-visible');
        } else {
          colOrig.classList.remove('mobile-visible');
          colProp.classList.add('mobile-visible');
        }
      });
    });

    // Touch Swipe Gesture within the code bounds
    let touchStartX = 0;
    let touchEndX = 0;

    viewer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      // Minimum swipe threshold 50px
      if (Math.abs(swipeDistance) < 55) return;

      const originalBtn = viewer.querySelector('.diff-switch-btn[data-side="original"]');
      const proposedBtn = viewer.querySelector('.diff-switch-btn[data-side="proposed"]');

      if (swipeDistance < 0) {
        // Swipe Left: Switch to Proposed Code
        if (proposedBtn) proposedBtn.click();
      } else {
        // Swipe Right: Switch to Original Code
        if (originalBtn) originalBtn.click();
      }
    }
  });
}

// ────────────────────────────────────────────────────────────
// 4. Swipe-Up Assistant Overlay & Backdrop
// ────────────────────────────────────────────────────────────
function initMobileAIDrawer() {
  const panel = document.getElementById('floating-ai-panel');
  const card = document.getElementById('ai-assistant-card');
  const toggle = document.getElementById('ai-assistant-toggle');
  
  if (!panel || !card || !toggle) return;

  // Add backdrop to DOM if missing
  let backdrop = document.querySelector('.ai-assistant-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'ai-assistant-backdrop';
    document.body.appendChild(backdrop);
  }

  // Backdrop click dismisses
  backdrop.addEventListener('click', collapseAIDrawer);

  // Bind close buttons
  const closeBtn = document.getElementById('ai-assistant-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', collapseAIDrawer);
  }

  // Monitor toggle clicks on mobile vs desktop
  toggle.addEventListener('click', (e) => {
    if (window.innerWidth > 768) return;
    
    e.stopPropagation();
    const isOpen = card.classList.contains('open');
    if (isOpen) {
      collapseAIDrawer();
    } else {
      expandAIDrawer();
    }
  });

  // Swipe Up from toggle triggers expand
  let touchStartY = 0;
  let touchEndY = 0;

  toggle.addEventListener('touchstart', (e) => {
    if (window.innerWidth > 768) return;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  toggle.addEventListener('touchend', (e) => {
    if (window.innerWidth > 768) return;
    touchEndY = e.changedTouches[0].screenY;
    if (touchStartY - touchEndY > 45) { // Swipe up
      expandAIDrawer();
    }
  }, { passive: true });

  // Swipe Down from AI card header triggers collapse
  const aiHeader = card.querySelector('.ai-card-header');
  if (aiHeader) {
    aiHeader.addEventListener('touchstart', (e) => {
      if (window.innerWidth > 768) return;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    aiHeader.addEventListener('touchend', (e) => {
      if (window.innerWidth > 768) return;
      touchEndY = e.changedTouches[0].screenY;
      if (touchEndY - touchStartY > 45) { // Swipe down
        collapseAIDrawer();
      }
    }, { passive: true });
  }

  function expandAIDrawer() {
    card.classList.add('open');
    backdrop.classList.add('visible');
  }

  function collapseAIDrawer() {
    card.classList.remove('open');
    backdrop.classList.remove('visible');
  }
}

// ────────────────────────────────────────────────────────────
// 5. Swipe-left dismissal of notifications
// ────────────────────────────────────────────────────────────
function initSwipeDismissNotifications() {
  // Capture clicks outside dropdown to reset bottom nav active state if dropdown closes
  document.addEventListener('click', (e) => {
    const activeMobileNotif = document.querySelector('.mobile-nav-item.active[data-tab="notifications"]');
    if (activeMobileNotif) {
      setTimeout(() => {
        const notifDropdown = document.getElementById('notification-dropdown');
        if (notifDropdown && !notifDropdown.classList.contains('open')) {
          highlightActiveTab();
        }
      }, 100);
    }
  });

  // Monitor notification items for swipe gestures
  const attachSwipeToNotifs = () => {
    const notifItems = document.querySelectorAll('.notif-item');
    notifItems.forEach(item => {
      if (item.getAttribute('data-swipe-bound')) return;
      item.setAttribute('data-swipe-bound', 'true');

      let startX = 0;
      let startY = 0;

      item.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
        startY = e.changedTouches[0].screenY;
      }, { passive: true });

      item.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].screenX;
        const endY = e.changedTouches[0].screenY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // Verify if swipe is primary horizontal (avoid trigger on scroll)
        if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 30) {
          if (deltaX < 0) { // Swipe Left
            item.classList.add('toast-dismissed');
            setTimeout(() => {
              item.remove();
              
              // If list is empty, write empty state message
              const list = document.querySelector('.notif-list');
              if (list && list.querySelectorAll('.notif-item').length === 0) {
                list.innerHTML = `
                  <div style="padding: 24px; text-align: center; color: var(--text-tertiary); font-size: 0.75rem;">
                    No notifications.
                  </div>
                `;
              }
            }, 300);
          }
        }
      }, { passive: true });
    });
  };

  attachSwipeToNotifs();

  // Re-observe if notification dropdown changes content
  const notifList = document.querySelector('.notif-list');
  if (notifList) {
    const observer = new MutationObserver(attachSwipeToNotifs);
    observer.observe(notifList, { childList: true });
  }
}

// ────────────────────────────────────────────────────────────
// 6. Scroll Up/Down Bottom Navigation Show/Hide
// ────────────────────────────────────────────────────────────
function initScrollBehavior() {
  let lastScrollY = window.scrollY;
  const bottomNav = document.querySelector('.mobile-bottom-nav');
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const bNav = document.querySelector('.mobile-bottom-nav');
    if (!bNav) return;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down, hide bottom nav
      bNav.classList.add('nav-hidden');
    } else {
      // Scrolling up, reveal bottom nav
      bNav.classList.remove('nav-hidden');
    }
    lastScrollY = currentScrollY;
  }, { passive: true });
}

// Helper: Debounce window resize loops
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
