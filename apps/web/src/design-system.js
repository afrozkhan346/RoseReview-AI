import './design-system.css';
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
  // 2. Sticky Scrollspy Navigation
  // ─────────────────────────────────────────────
  const navItems = document.querySelectorAll('.ds-nav-item');
  const panels = document.querySelectorAll('.ds-section-panel');
  const scrollContainer = document.querySelector('.dash-scroll-view');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href');
      const targetPanel = document.querySelector(targetId);

      if (targetPanel && scrollContainer) {
        scrollContainer.scrollTo({
          top: targetPanel.offsetTop - 88,
          behavior: 'smooth'
        });

        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

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
  // 3. Dropdown Selector Click Handlers
  // ─────────────────────────────────────────────
  const dsSwitcher = document.getElementById('ds-repo-switcher');
  const dsDropdown = document.getElementById('ds-repo-dropdown');

  if (dsSwitcher && dsDropdown) {
    dsSwitcher.addEventListener('click', (e) => {
      e.stopPropagation();
      dsDropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      dsDropdown.classList.remove('open');
    });

    const options = dsDropdown.querySelectorAll('.repo-option');
    const label = dsSwitcher.querySelector('.current-repo');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        if (label) label.textContent = opt.textContent;
      });
    });
  }

  // ─────────────────────────────────────────────
  // 4. AI Ingest Scanner Simulator
  // ─────────────────────────────────────────────
  const scanTrigger = document.getElementById('btn-trigger-scan');
  const scanLine = document.getElementById('scanner-line-bar');
  const scanText = document.getElementById('scanner-text-indicator');

  let isScanning = true;
  let scanProgress = 78;
  let scanInterval = null;

  const runScanSimulation = () => {
    if (!scanLine || !scanText) return;
    
    scanInterval = setInterval(() => {
      scanProgress += Math.floor(Math.random() * 8) - 3;
      if (scanProgress > 98) scanProgress = 40; // reset
      if (scanProgress < 20) scanProgress = 50;

      scanLine.style.width = `${scanProgress}%`;
      
      const modules = [
        'apps/api/src/billing.ts',
        'packages/shared/types.ts',
        'apps/api/src/auth.ts',
        'docs-website/config.js',
        'packages/billing/index.js'
      ];
      const activeModule = modules[Math.floor(scanProgress / 20) % modules.length];
      scanText.textContent = `Scanning code modules: ${activeModule} (${scanProgress}%)`;
    }, 1500);
  };

  if (scanTrigger) {
    scanTrigger.addEventListener('click', () => {
      if (isScanning) {
        clearInterval(scanInterval);
        isScanning = false;
        scanTrigger.textContent = 'Resume Ingest Scan';
        if (scanText) scanText.textContent = 'Scanner paused by developer operator';
      } else {
        isScanning = true;
        scanTrigger.textContent = 'Pause Ingest Scan';
        runScanSimulation();
      }
    });
  }

  // Auto start scan simulation
  runScanSimulation();

  // ─────────────────────────────────────────────
  // 5. Modal and Overlay Previews
  // ─────────────────────────────────────────────
  const modalTrigger = document.getElementById('btn-trigger-modal');
  const modalFrame = document.getElementById('sample-modal-frame');
  const closeModalX = document.getElementById('btn-close-modal');
  const modalCancel = document.getElementById('btn-modal-cancel');
  const modalConfirm = document.getElementById('btn-modal-confirm');

  const openModal = () => {
    if (modalFrame) {
      modalFrame.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock body scroll
    }
  };

  const closeModal = () => {
    if (modalFrame) {
      modalFrame.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (modalTrigger) modalTrigger.addEventListener('click', openModal);
  
  [closeModalX, modalCancel, modalConfirm].forEach(btn => {
    if (btn) btn.addEventListener('click', closeModal);
  });

  if (modalFrame) {
    modalFrame.addEventListener('click', (e) => {
      if (e.target === modalFrame) closeModal();
    });
  }

  // ─────────────────────────────────────────────
  // 6. Toast Notification Simulation
  // ─────────────────────────────────────────────
  const toastTrigger = document.getElementById('btn-trigger-toast');
  const toastBox = document.getElementById('sample-toast-box');

  if (toastTrigger && toastBox) {
    toastTrigger.addEventListener('click', () => {
      toastBox.classList.add('show');
      
      // Auto hide after 3.5s
      setTimeout(() => {
        toastBox.classList.remove('show');
      }, 3500);
    });
  }
});
