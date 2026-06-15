import './auth.css';
import './responsive.js';

document.addEventListener('DOMContentLoaded', () => {
  const isLoginPage = document.body.classList.contains('auth-page--login');
  const isSignupPage = document.body.classList.contains('auth-page--signup');

  // --- Utility Functions ---
  const showError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add('auth-field--error');
    field.classList.remove('auth-field--success');
    const errorSpan = field.querySelector('.auth-field-error');
    if (errorSpan) errorSpan.textContent = message;
  };

  const clearError = (fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.remove('auth-field--error');
    const errorSpan = field.querySelector('.auth-field-error');
    if (errorSpan) errorSpan.textContent = '';
  };

  const setSuccess = (fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.remove('auth-field--error');
    field.classList.add('auth-field--success');
    const errorSpan = field.querySelector('.auth-field-error');
    if (errorSpan) errorSpan.textContent = '';
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const shakeCard = (cardId) => {
    const card = document.getElementById(cardId);
    if (!card) return;
    card.classList.remove('auth-shake');
    void card.offsetWidth; // trigger reflow
    card.classList.add('auth-shake');
    setTimeout(() => card.classList.remove('auth-shake'), 500);
  };

  // --- Password Toggles ---
  document.querySelectorAll('.auth-toggle-pw').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const input = btn.previousElementSibling;
      const showIcon = btn.querySelector('.pw-icon-show');
      const hideIcon = btn.querySelector('.pw-icon-hide');
      if (input.type === 'password') {
        input.type = 'text';
        if(showIcon) showIcon.style.display = 'none';
        if(hideIcon) hideIcon.style.display = 'block';
      } else {
        input.type = 'password';
        if(showIcon) showIcon.style.display = 'block';
        if(hideIcon) hideIcon.style.display = 'none';
      }
    });
  });

  // --- Input Focus Effects & Smooth Validation ---
  document.querySelectorAll('.auth-input').forEach(input => {
    const field = input.closest('.auth-field');
    input.addEventListener('focus', () => {
      field?.classList.add('auth-field--focused');
      clearError(field?.id);
    });
    input.addEventListener('blur', () => {
      field?.classList.remove('auth-field--focused');
      if (input.type === 'email' && input.value) {
        if (!validateEmail(input.value)) {
          showError(field?.id, 'Please enter a valid email address');
        } else {
          setSuccess(field?.id);
        }
      }
    });
  });

  // --- Login Specific ---
  if (isLoginPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      const emailInput = document.getElementById('login-email');
      if (emailInput) {
         emailInput.value = emailParam;
         setTimeout(() => emailInput.focus(), 100);
      }
    }

    // Spinner Animation
    const spinnerEl = document.querySelector('.auth-term-spinner');
    if (spinnerEl) {
      const chars = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
      let i = 0;
      const interval = setInterval(() => {
        spinnerEl.textContent = chars[i];
        i = (i + 1) % chars.length;
      }, 80);

      setTimeout(() => {
        clearInterval(interval);
        spinnerEl.textContent = '✓';
        spinnerEl.classList.remove('auth-term-spinner');
        spinnerEl.classList.add('auth-term-ok');
        const activeLine = document.querySelector('.auth-term-active');
        if(activeLine) activeLine.innerHTML = '<span class="auth-term-pre">▸</span> Review complete — 6 findings <span class="auth-term-ok">✓</span>';
      }, 4000);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;
        
        const email = document.getElementById('login-email').value;
        if (!email || !validateEmail(email)) {
          showError('field-email', 'Valid email is required');
          isValid = false;
        }

        const pass = document.getElementById('login-password').value;
        if (!pass || pass.length < 6) {
          showError('field-password', 'Password must be at least 6 characters');
          isValid = false;
        }

        if (isValid) {
          const btn = document.getElementById('btn-login');
          if(btn) {
              const text = btn.querySelector('.auth-btn-text');
              const loader = btn.querySelector('.auth-btn-loader');
              if(text) text.style.display = 'none';
              if(loader) loader.style.display = 'flex';
              btn.disabled = true;
          }

          try {
            const res = await fetch('/api/v1/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password: pass })
            });

            if (!res.ok) {
              const errData = await res.json().catch(() => null);
              throw new Error(errData?.message || 'Invalid credentials');
            }

            const rememberMe = document.getElementById('remember-me')?.checked;
            if (rememberMe) {
              localStorage.setItem('isAuthenticated', 'true');
            } else {
              sessionStorage.setItem('isAuthenticated', 'true');
            }
            alert('Login successful!');
            window.location.href = '/dashboard.html';
          } catch (err) {
            showError('field-password', err.message);
            if (btn) {
              const text = btn.querySelector('.auth-btn-text');
              const loader = btn.querySelector('.auth-btn-loader');
              if(text) text.style.display = 'inline-block';
              if(loader) loader.style.display = 'none';
              btn.disabled = false;
            }
          }
        } else {
          shakeCard('login-card');
        }
      });
    }
  }

  // --- Signup Specific ---
  if (isSignupPage) {
    const passInput = document.getElementById('signup-password');
    const confInput = document.getElementById('signup-confirm-password');
    
    // Password Strength
    if (passInput) {
      passInput.addEventListener('input', () => {
        const val = passInput.value;
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        const fill = document.getElementById('pw-strength-fill');
        const text = document.getElementById('pw-strength-text');
        
        if (val.length === 0) {
            if(fill) fill.style.width = '0%';
            if(text) text.textContent = '';
            return;
        }

        let width, color, label;
        if (score <= 1) { width = '25%'; color = 'var(--accent-red)'; label = 'Weak'; }
        else if (score === 2) { width = '50%'; color = 'var(--accent-amber)'; label = 'Fair'; }
        else if (score >= 3 && score <= 4) { width = '75%'; color = 'var(--accent-blue)'; label = 'Good'; }
        else { width = '100%'; color = 'var(--accent-green)'; label = 'Strong'; }

        if(fill) {
            fill.style.width = width;
            fill.style.backgroundColor = color;
        }
        if(text) {
            text.textContent = label;
            text.style.color = color;
        }
        
        // check confirm pass match real-time
        if (confInput && confInput.value) {
          if (val === confInput.value) setSuccess('field-confirm-password');
          else showError('field-confirm-password', 'Passwords do not match');
        }
        updateSteps();
      });
    }

    if (confInput) {
      confInput.addEventListener('input', () => {
        if (passInput && confInput.value === passInput.value && confInput.value.length > 0) {
          setSuccess('field-confirm-password');
        } else {
          showError('field-confirm-password', 'Passwords do not match');
        }
        updateSteps();
      });
    }

    // Onboarding Wizard State & Logic
    let activeStep = 1;

    const showStep = (stepNum) => {
      activeStep = stepNum;

      // Hide all step content panes and show the active one
      document.querySelectorAll('[data-step-pane]').forEach(pane => {
        pane.classList.remove('active');
        if (parseInt(pane.dataset.stepPane, 10) === stepNum) {
          pane.classList.add('active');
        }
      });

      // Update top progress indicators
      const step1 = document.querySelector('[data-step="1"]');
      const step2 = document.querySelector('[data-step="2"]');
      const step3 = document.querySelector('[data-step="3"]');
      const lines = document.querySelectorAll('.auth-step-line');

      [step1, step2, step3].forEach(s => s?.classList.remove('auth-step--active', 'auth-step--completed'));
      lines.forEach(l => l.classList.remove('auth-step-line--active'));

      if (stepNum === 1) {
        step1?.classList.add('auth-step--active');
      } else if (stepNum === 2) {
        step1?.classList.add('auth-step--completed');
        step2?.classList.add('auth-step--active');
        if (lines[0]) lines[0].classList.add('auth-step-line--active');
      } else if (stepNum === 3) {
        step1?.classList.add('auth-step--completed');
        step2?.classList.add('auth-step--completed');
        step3?.classList.add('auth-step--active');
        if (lines[0]) lines[0].classList.add('auth-step-line--active');
        if (lines[1]) lines[1].classList.add('auth-step-line--active');
      }
    };

    const validateStep1 = () => {
      let isValid = true;

      const name = document.getElementById('signup-fullname')?.value?.trim();
      if (!name || name.length < 2) {
        showError('field-fullname', 'Full name is required');
        isValid = false;
      } else {
        setSuccess('field-fullname');
      }

      const email = document.getElementById('signup-email')?.value?.trim();
      if (!email || !validateEmail(email)) {
        showError('field-work-email', 'Valid work email is required');
        isValid = false;
      } else {
        setSuccess('field-work-email');
      }

      const pass = passInput?.value;
      if (!pass || pass.length < 8) {
        showError('field-signup-password', 'Password must be at least 8 characters');
        isValid = false;
      } else {
        setSuccess('field-signup-password');
      }

      const conf = confInput?.value;
      if (pass !== conf) {
        showError('field-confirm-password', 'Passwords do not match');
        isValid = false;
      } else if (conf) {
        setSuccess('field-confirm-password');
      }

      return isValid;
    };

    // Role Pills toggling
    const rolePills = document.querySelectorAll('.role-pill');
    const signupPersonaInput = document.getElementById('signup-persona');
    rolePills.forEach(pill => {
      pill.addEventListener('click', () => {
        rolePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        if (signupPersonaInput) {
          signupPersonaInput.value = pill.dataset.role;
        }
      });
    });

    const validateTerms = () => {
      let isValid = true;
      const terms = document.getElementById('accept-terms');
      if (!terms || !terms.checked) {
        showError('field-terms', 'You must accept the terms of service to continue');
        isValid = false;
      } else {
        setSuccess('field-terms');
      }
      return isValid;
    };

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Full Validation Check
        const s1 = validateStep1();
        const sT = validateTerms();

        if (!s1 || !sT) {
          shakeCard('signup-card');
          return;
        }

        const btn = document.getElementById('btn-signup');
        if (btn) {
          const text = btn.querySelector('.auth-btn-text');
          const loader = btn.querySelector('.auth-btn-loader');
          if (text) text.style.display = 'none';
          if (loader) loader.style.display = 'flex';
          btn.disabled = true;
        }

        const email = document.getElementById('signup-email')?.value || '';
        const pass = passInput?.value;
        const name = document.getElementById('signup-fullname')?.value || '';
        const persona = signupPersonaInput?.value || 'solo';

        try {
          const res = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass, name, persona })
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => null);
            throw new Error(errData?.message || 'Failed to create account');
          }

          localStorage.setItem('isAuthenticated', 'true');
          alert('Account created successfully!');
          window.location.href = '/onboarding.html';
        } catch (err) {
          showError('field-signup-password', err.message);
          if (btn) {
            const text = btn.querySelector('.auth-btn-text');
            const loader = btn.querySelector('.auth-btn-loader');
            if (text) text.style.display = 'inline-block';
            if (loader) loader.style.display = 'none';
            btn.disabled = false;
          }
        }
      });
    }
  }

  // --- OAuth Buttons (GitHub Sign In / Sign Up) ---
  document.querySelectorAll('.auth-oauth-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.innerHTML = '<span class="auth-spinner" style="width:14px;height:14px;margin-right:8px;border-width:2px;display:inline-block;animation:authSpin 0.6s linear infinite;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;"></span> Redirecting to GitHub...';
      btn.disabled = true;

      // Redirect directly to backend Fastify OAuth2 endpoint
      window.location.href = '/api/v1/auth/github';
    });
  });

  // --- Form Field Entry Animation ---
  const fields = document.querySelectorAll('.auth-field');
  fields.forEach((field, index) => {
    field.style.opacity = '0';
    field.style.transform = 'translateY(10px)';
    field.style.transition = `opacity 0.4s ease forwards, transform 0.4s ease forwards`;
    setTimeout(() => {
      field.style.opacity = '1';
      field.style.transform = 'translateY(0)';
    }, 100 + (index * 50));
  });

});
