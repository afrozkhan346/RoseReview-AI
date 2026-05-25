import './styles.css';
import './responsive.js';

document.addEventListener('DOMContentLoaded', () => {
  // ─────────────────────────────────────────────
  // 1. Intersection Observer — Scroll Animations
  // ─────────────────────────────────────────────

  const staggerContainerSelectors = [
    '.problems-grid',
    '.capabilities-grid',
    '.metrics-grid',
    '.human-grid',
    '.pricing-grid',
  ];

  // Collect all children inside stagger containers so we can skip them
  // in the generic observer and handle them with per-container observers.
  const staggerChildSet = new Set();

  staggerContainerSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((container) => {
      const children = container.querySelectorAll('.animate-on-scroll');
      children.forEach((child) => staggerChildSet.add(child));

      const containerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              children.forEach((child, index) => {
                child.style.transitionDelay = `${index * 100}ms`;
                child.classList.add('visible');
              });
              containerObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );

      containerObserver.observe(container);
    });
  });

  // Generic observer for all other .animate-on-scroll elements
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    if (!staggerChildSet.has(el)) {
      scrollObserver.observe(el);
    }
  });

  // ─────────────────────────────────────────────
  // 2. Navigation Scroll Effects
  // ─────────────────────────────────────────────

  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // initial check

  // Smooth scroll for anchor links
  document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─────────────────────────────────────────────
  // 3. Mobile Menu Toggle
  // ─────────────────────────────────────────────

  const mobileToggle = document.getElementById('nav-mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ─────────────────────────────────────────────
  // 4. Terminal Spinner Animation
  // ─────────────────────────────────────────────

  const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let spinnerIndex = 0;
  const spinnerEl = document.querySelector('.terminal-spinner');
  let spinnerInterval = null;

  if (spinnerEl) {
    spinnerInterval = setInterval(() => {
      spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
      spinnerEl.textContent = spinnerChars[spinnerIndex];
    }, 80);
  }

  // ─────────────────────────────────────────────
  // 5. Dashboard Ring Animations
  // ─────────────────────────────────────────────

  const dashRings = document.querySelectorAll('.dash-ring-progress');
  const heroDashboard = document.querySelector('.hero-dashboard');

  if (dashRings.length && heroDashboard) {
    // Store target values and zero-out initially
    dashRings.forEach((ring) => {
      const target = ring.getAttribute('stroke-dasharray');
      ring.dataset.targetDash = target;
      ring.setAttribute('stroke-dasharray', '0 999');
    });

    const ringObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dashRings.forEach((ring) => {
              const target = ring.dataset.targetDash;
              ring.style.transition = 'stroke-dasharray 2s cubic-bezier(0.4, 0, 0.2, 1)';
              // Use rAF to ensure the zero state is painted first
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  ring.setAttribute('stroke-dasharray', target);
                });
              });
            });
            ringObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    ringObserver.observe(heroDashboard);
  }

  // ─────────────────────────────────────────────
  // 6. Counter Animations
  // ─────────────────────────────────────────────

  function animateCounter(el, target, duration = 2000, isPercentage = false) {
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * ease);

      el.textContent = isPercentage ? `${current}%` : current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.dash-metric-num');

  if (counterEls.length) {
    counterEls.forEach((el) => {
      const rawText = el.textContent.trim();
      const isPercentage = rawText.includes('%');
      const target = parseInt(rawText.replace(/[^0-9]/g, ''), 10);

      if (isNaN(target)) return;

      // Store and zero-out
      el.dataset.counterTarget = target;
      el.dataset.counterPct = isPercentage ? '1' : '0';
      el.textContent = isPercentage ? '0%' : '0';

      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(
                entry.target,
                parseInt(entry.target.dataset.counterTarget, 10),
                2000,
                entry.target.dataset.counterPct === '1',
              );
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 },
      );

      counterObserver.observe(el);
    });
  }

  // ─────────────────────────────────────────────
  // 7. Severity / Benchmark / Metric / Coverage Bar Animations
  // ─────────────────────────────────────────────

  const barSelectors = [
    '.severity-fill',
    '.benchmark-fill',
    '.metric-bar-fill',
    '.coverage-fill',
  ];

  barSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((bar) => {
      const targetWidth = bar.style.width;
      if (!targetWidth) return;

      bar.dataset.targetWidth = targetWidth;
      bar.style.width = '0';
      bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';

      const barObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              requestAnimationFrame(() => {
                entry.target.style.width = entry.target.dataset.targetWidth;
              });
              barObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 },
      );

      barObserver.observe(bar);
    });
  });

  // ─────────────────────────────────────────────
  // 8. Chart Line Drawing Animation
  // ─────────────────────────────────────────────

  const chartLines = document.querySelectorAll('.chart-line-animate');

  chartLines.forEach((line) => {
    const length = line.getTotalLength ? line.getTotalLength() : 0;
    if (!length) return;

    line.style.strokeDasharray = `${length}`;
    line.style.strokeDashoffset = `${length}`;
    line.style.transition = 'stroke-dashoffset 2.5s cubic-bezier(0.4, 0, 0.2, 1)';

    const lineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.style.strokeDashoffset = '0';
            });
            lineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    lineObserver.observe(line);
  });

  // ─────────────────────────────────────────────
  // 9. Gauge Animation
  // ─────────────────────────────────────────────

  const gauges = document.querySelectorAll('.gauge-animate');

  gauges.forEach((gauge) => {
    const targetDash = gauge.getAttribute('stroke-dasharray');
    if (!targetDash) return;

    gauge.dataset.targetGauge = targetDash;
    gauge.setAttribute('stroke-dasharray', '0 157');
    gauge.style.transition = 'stroke-dasharray 2s cubic-bezier(0.4, 0, 0.2, 1)';

    const gaugeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                entry.target.setAttribute(
                  'stroke-dasharray',
                  entry.target.dataset.targetGauge,
                );
              });
            });
            gaugeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    gaugeObserver.observe(gauge);
  });

  // ─────────────────────────────────────────────
  // 10. Smooth Hover Parallax on Dashboard
  // ─────────────────────────────────────────────

  const heroSection = document.querySelector('.hero');
  const dashboardEl = document.querySelector('.hero-dashboard');

  if (heroSection && dashboardEl) {
    dashboardEl.style.transition = 'transform 0.3s ease-out';

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized -1 to 1
      const normX = (e.clientX - centerX) / (rect.width / 2);
      const normY = (e.clientY - centerY) / (rect.height / 2);

      const maxRotate = 3;
      const rotateY = normX * maxRotate;
      const rotateX = -normY * maxRotate;

      dashboardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      dashboardEl.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // ─────────────────────────────────────────────
  // 11. Active Nav Link Highlighting
  // ─────────────────────────────────────────────

  const sectionIds = ['#capabilities', '#metrics', '#pricing'];
  const sections = sectionIds
    .map((id) => document.querySelector(id))
    .filter(Boolean);
  const navLinksAll = document.querySelectorAll('.nav-link[href^="#"]');

  const highlightActiveLink = () => {
    const scrollPos = window.scrollY + 120; // offset for fixed nav

    let currentSectionId = '';

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        currentSectionId = `#${section.id}`;
      }
    });

    navLinksAll.forEach((link) => {
      if (link.getAttribute('href') === currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', highlightActiveLink, { passive: true });
  highlightActiveLink(); // initial

  // ─────────────────────────────────────────────
  // 12. Typing Effect for Terminal
  // ─────────────────────────────────────────────

  const terminalActiveLine = document.querySelector(
    '.terminal-line.active .terminal-text, .terminal-line-active .terminal-text',
  );

  if (terminalActiveLine && spinnerEl) {
    setTimeout(() => {
      // Stop the spinner
      if (spinnerInterval) {
        clearInterval(spinnerInterval);
        spinnerInterval = null;
      }

      // Replace spinner with green checkmark
      spinnerEl.textContent = '✔';
      spinnerEl.style.color = '#4ade80';
      spinnerEl.classList.remove('terminal-spinner');

      // Type out the completion text
      const completionText = 'Review complete — 6 findings identified';
      terminalActiveLine.textContent = '';

      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < completionText.length) {
          terminalActiveLine.textContent += completionText[charIndex];
          charIndex++;
        } else {
          clearInterval(typeInterval);

          // Add summary line after a brief pause
          setTimeout(() => {
            const terminalBody = document.querySelector(
              '.terminal-body, .terminal-content',
            );
            if (terminalBody) {
              const summaryLine = document.createElement('div');
              summaryLine.className = 'terminal-line';
              summaryLine.innerHTML =
                '<span class="terminal-prompt" style="color:#4ade80;">→</span> <span class="terminal-text" style="color:#94a3b8;">3 critical · 2 moderate · 1 info</span>';
              summaryLine.style.opacity = '0';
              summaryLine.style.transform = 'translateY(5px)';
              summaryLine.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              terminalBody.appendChild(summaryLine);

              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  summaryLine.style.opacity = '1';
                  summaryLine.style.transform = 'translateY(0)';
                });
              });
            }
          }, 400);
        }
      }, 35);
    }, 3000);
  }
});
