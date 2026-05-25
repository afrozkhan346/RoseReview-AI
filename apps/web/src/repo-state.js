// ─────────────────────────────────────────────
// Global Repository State Management
// ─────────────────────────────────────────────

export function getTrackedRepos() {
  try {
    return JSON.parse(localStorage.getItem('trackedRepos') || '[]');
  } catch { return []; }
}

export function saveTrackedRepos(repos) {
  localStorage.setItem('trackedRepos', JSON.stringify(repos));
}

export function addTrackedRepo(owner, name) {
  const repos = getTrackedRepos();
  const exists = repos.find(r => r.owner === owner && r.name === name);
  if (!exists) {
    repos.push({ owner, name });
    saveTrackedRepos(repos);
  }
}

export function selectRepo(owner, name) {
  localStorage.setItem('selectedRepoOwner', owner);
  localStorage.setItem('selectedRepoName', name);

  const currentRepoEl = document.querySelector('.current-repo');
  if (currentRepoEl) currentRepoEl.textContent = `${owner}/${name}`;

  document.querySelectorAll('.repo-option').forEach(o => {
    if (o.dataset.owner === owner && o.dataset.name === name) {
      o.classList.add('active');
    } else {
      o.classList.remove('active');
    }
  });

  // Dispatch global event so all pages/panels can react
  window.dispatchEvent(new CustomEvent('repoChanged', { 
    detail: { owner, name, fullName: `${owner}/${name}` } 
  }));
}

export function renderRepoDropdown() {
  const dropdown = document.getElementById('repo-dropdown');
  if (!dropdown) return;

  const repos = getTrackedRepos();
  const selectedOwner = localStorage.getItem('selectedRepoOwner');
  const selectedName = localStorage.getItem('selectedRepoName');

  if (repos.length === 0) {
    dropdown.innerHTML = '<div class="repo-option" style="color: var(--text-secondary); font-style: italic;">Paste a PR URL to add a repo</div>';
    const currentRepoEl = document.querySelector('.current-repo');
    if (currentRepoEl) currentRepoEl.textContent = 'No repo selected';
    return;
  }

  dropdown.innerHTML = '';
  repos.forEach(repo => {
    const opt = document.createElement('div');
    opt.className = 'repo-option';
    if (repo.owner === selectedOwner && repo.name === selectedName) {
      opt.classList.add('active');
    }
    opt.textContent = `${repo.owner}/${repo.name}`;
    opt.dataset.owner = repo.owner;
    opt.dataset.name = repo.name;
    opt.addEventListener('click', () => {
      selectRepo(repo.owner, repo.name);
      dropdown.classList.remove('open');
    });
    dropdown.appendChild(opt);
  });
}

export function parsePrUrl(val) {
  const urlMatch = val.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2], prNumber: urlMatch[3] };
  }
  const shortMatch = val.match(/^([^/]+)\/([^#]+)#(\d+)$/);
  if (shortMatch) {
    return { owner: shortMatch[1], repo: shortMatch[2], prNumber: shortMatch[3] };
  }
  const numMatch = val.replace('#', '').trim();
  if (/^\d+$/.test(numMatch)) {
    const owner = localStorage.getItem('selectedRepoOwner');
    const name = localStorage.getItem('selectedRepoName');
    if (owner && name) {
      return { owner, repo: name, prNumber: numMatch };
    }
  }
  return null;
}

// Initialize UI on load
export function initRepoState() {
  renderRepoDropdown();
  
  // Set initial selected repo if any
  const savedOwner = localStorage.getItem('selectedRepoOwner');
  const savedName = localStorage.getItem('selectedRepoName');
  if (savedOwner && savedName) {
    const currentRepoEl = document.querySelector('.current-repo');
    if (currentRepoEl) currentRepoEl.textContent = `${savedOwner}/${savedName}`;
    // Dispatch initial event
    window.dispatchEvent(new CustomEvent('repoChanged', { 
      detail: { owner: savedOwner, name: savedName, fullName: `${savedOwner}/${savedName}` } 
    }));
  }
}
