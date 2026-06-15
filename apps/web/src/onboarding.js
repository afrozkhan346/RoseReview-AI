let currentStep = 1;
let selectedPersona = 'solo';
let userData = null;

// Dynamic Templates for Screen 2
const contextTemplates = {
  solo: `
    <div class="field-group">
      <label class="label">What kind of projects do you work on? (Select all that apply)</label>
      <div class="pill-group" id="project-types">
        <span class="pill" data-val="personal">Personal Projects</span>
        <span class="pill" data-val="client">Client Work</span>
        <span class="pill" data-val="open_source">Open Source</span>
        <span class="pill" data-val="side_project">Side Projects / Startups</span>
      </div>
    </div>
    <div class="field-group">
      <label class="label">Primary language you review most</label>
      <div class="pill-group" id="primary-lang">
        <span class="pill active" data-val="javascript">JS / TS</span>
        <span class="pill" data-val="python">Python</span>
        <span class="pill" data-val="go">Go</span>
        <span class="pill" data-val="java">Java</span>
        <span class="pill" data-val="other">Other</span>
      </div>
    </div>
  `,
  team: `
    <div class="field-group">
      <label class="label">Team or Company Name</label>
      <input type="text" class="input" id="team-name" placeholder="e.g. Acme Engineering" required />
    </div>
    <div class="field-group">
      <label class="label">How many developers on your team?</label>
      <div class="pill-group" id="team-size">
        <span class="pill active" data-val="2-5">2 - 5 devs</span>
        <span class="pill" data-val="6-15">6 - 15 devs</span>
        <span class="pill" data-val="16-50">16 - 50 devs</span>
        <span class="pill" data-val="50+">50+ devs</span>
      </div>
    </div>
    <div class="field-group">
      <label class="label">Where is your codebase hosted?</label>
      <div class="pill-group" id="code-host">
        <span class="pill active" data-val="github">GitHub.com</span>
        <span class="pill" data-val="github_enterprise">GitHub Enterprise</span>
        <span class="pill" data-val="both">Both</span>
      </div>
    </div>
  `,
  company: `
    <div class="field-group">
      <label class="label">Company Name</label>
      <input type="text" class="input" id="company-name" placeholder="e.g. Acme Inc." required />
    </div>
    <div class="field-group">
      <label class="label">How many developers in the organization?</label>
      <div class="pill-group" id="org-size">
        <span class="pill active" data-val="2-10">2 - 10</span>
        <span class="pill" data-val="10-50">10 - 50</span>
        <span class="pill" data-val="50-200">50 - 200</span>
        <span class="pill" data-val="200+">200+</span>
      </div>
    </div>
  `,
  open_source: `
    <div class="field-group">
      <label class="label">Project Name</label>
      <input type="text" class="input" id="project-name" placeholder="e.g. React Router" required />
    </div>
    <div class="field-group">
      <label class="label">Main Repository URL</label>
      <input type="text" class="input" id="repo-url" placeholder="https://github.com/owner/repo" required />
    </div>
    <div class="field-group">
      <label class="label">Your role in the project</label>
      <div class="pill-group" id="project-role">
        <span class="pill active" data-val="maintainer">Maintainer</span>
        <span class="pill" data-val="contributor">Core Contributor</span>
        <span class="pill" data-val="triager">Triager</span>
      </div>
    </div>
  `,
  freelancer: `
    <div class="field-group">
      <label class="label">Do you work across multiple client repos?</label>
      <div class="pill-group" id="multi-client">
        <span class="pill active" data-val="yes">Yes — across multiple clients</span>
        <span class="pill" data-val="no">No — mostly one at a time</span>
      </div>
    </div>
    <div class="field-group">
      <label class="label">Typical PR size you review</label>
      <div class="pill-group" id="pr-size">
        <span class="pill active" data-val="small">Small (&lt; 100 lines)</span>
        <span class="pill" data-val="medium">Medium (100 - 500 lines)</span>
        <span class="pill" data-val="large">Large (500+ lines)</span>
      </div>
    </div>
  `
};

// Handle Multi-select and Single-select Pills
function bindPillListeners(containerId, isMulti = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const pills = container.querySelectorAll('.pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (!isMulti) {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      } else {
        pill.classList.toggle('active');
      }
    });
  });
}

function renderPane2() {
  const container = document.getElementById('dynamic-context');
  // If Selected persona is "company" but has team template, let's select persona
  const template = contextTemplates[selectedPersona] || contextTemplates.solo;
  container.innerHTML = template;

  // Bind dynamic pill elements
  if (selectedPersona === 'solo') {
    bindPillListeners('project-types', true);
    bindPillListeners('primary-lang', false);
  } else if (selectedPersona === 'team') {
    bindPillListeners('team-size', false);
    bindPillListeners('code-host', false);
  } else if (selectedPersona === 'company') {
    bindPillListeners('org-size', false);
  } else if (selectedPersona === 'open_source') {
    bindPillListeners('project-role', false);
  } else if (selectedPersona === 'freelancer') {
    bindPillListeners('multi-client', false);
    bindPillListeners('pr-size', false);
  }
}

// Check auth state
async function checkAuth() {
  try {
    const res = await fetch('/api/v1/auth/me');
    if (!res.ok) {
      window.location.href = '/login.html';
      return;
    }
    const data = await res.json();
    userData = data.data;

    if (userData.isOnboarded) {
      window.location.href = '/dashboard.html';
      return;
    }

    // Set persona based on what was chosen during signup
    if (userData.persona) {
      selectedPersona = userData.persona;
      document.querySelectorAll('.persona-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.persona === selectedPersona) {
          opt.classList.add('selected');
        }
      });
    }
  } catch (err) {
    window.location.href = '/login.html';
  }
}

// Retrieve values from the forms
function getOnboardingData() {
  const data = {};
  if (selectedPersona === 'solo') {
    const types = Array.from(document.querySelectorAll('#project-types .pill.active')).map(p => p.dataset.val);
    const lang = document.querySelector('#primary-lang .pill.active')?.dataset.val || 'javascript';
    data.projectTypes = types;
    data.primaryLanguage = lang;
  } else if (selectedPersona === 'team') {
    data.teamName = document.getElementById('team-name')?.value || '';
    data.teamSize = document.querySelector('#team-size .pill.active')?.dataset.val || '';
    data.codeHost = document.querySelector('#code-host .pill.active')?.dataset.val || '';
  } else if (selectedPersona === 'company') {
    data.companyName = document.getElementById('company-name')?.value || '';
    data.orgSize = document.querySelector('#org-size .pill.active')?.dataset.val || '';
  } else if (selectedPersona === 'open_source') {
    data.projectName = document.getElementById('project-name')?.value || '';
    data.repoUrl = document.getElementById('repo-url')?.value || '';
    data.projectRole = document.querySelector('#project-role .pill.active')?.dataset.val || '';
  } else if (selectedPersona === 'freelancer') {
    data.multiClient = document.querySelector('#multi-client .pill.active')?.dataset.val || '';
    data.prSize = document.querySelector('#pr-size .pill.active')?.dataset.val || '';
  }

  // Add step 3 values
  data.defaultRepo = document.getElementById('onboard-repo')?.value || '';
  data.referralSource = document.querySelector('#referral-group .pill.active')?.dataset.val || '';
  return data;
}

// Navigation & step management
function updateStepUI() {
  document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
  document.getElementById(`pane-${currentStep}`).classList.add('active');

  // Handle nav nodes
  for (let i = 1; i <= 3; i++) {
    const node = document.getElementById(`node-${i}`);
    if (i < currentStep) {
      node.className = 'step-node completed';
    } else if (i === currentStep) {
      node.className = 'step-node active';
    } else {
      node.className = 'step-node';
    }
  }

  // Line progress fill
  const progressPercent = ((currentStep - 1) / 2) * 80;
  document.getElementById('progress-bar').style.width = `${progressPercent}%`;

  // Buttons visibility & text
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');

  if (currentStep === 1) {
    btnBack.style.display = 'none';
    btnNext.textContent = 'Continue →';
  } else {
    btnBack.style.display = 'inline-block';
    if (currentStep === 3) {
      btnNext.textContent = 'Complete Workspace Setup ✓';
    } else {
      btnNext.textContent = 'Continue →';
    }
  }
}

async function submitOnboarding() {
  const onboardingData = getOnboardingData();
  const payload = {
    persona: selectedPersona,
    onboardingData
  };

  const btnNext = document.getElementById('btn-next');
  btnNext.disabled = true;
  btnNext.textContent = 'Setting up workspace...';

  try {
    const res = await fetch('/api/v1/user/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error('Failed to complete onboarding');
    }

    alert('Workspace setup completed successfully!');
    window.location.href = '/dashboard.html';
  } catch (err) {
    alert(err.message);
    btnNext.disabled = false;
    btnNext.textContent = 'Complete Workspace Setup ✓';
  }
}

// Init Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  // Bind Screen 1 Selection
  document.querySelectorAll('.persona-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.persona-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedPersona = opt.dataset.persona;
    });
  });

  // Bind Screen 3 Pills
  bindPillListeners('referral-group', false);

  // Next / Back buttons
  document.getElementById('btn-next').addEventListener('click', () => {
    if (currentStep === 1) {
      renderPane2();
      currentStep = 2;
      updateStepUI();
    } else if (currentStep === 2) {
      // Validate inputs in Screen 2
      const inputs = document.getElementById('pane-2').querySelectorAll('input[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#ef4444';
          valid = false;
        } else {
          input.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        }
      });
      if (!valid) return;

      currentStep = 3;
      updateStepUI();
    } else if (currentStep === 3) {
      submitOnboarding();
    }
  });

  document.getElementById('btn-back').addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepUI();
    }
  });
});
