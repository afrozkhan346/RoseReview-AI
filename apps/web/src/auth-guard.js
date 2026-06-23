export function enforceAuth() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('auth') === 'success') {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('isGithubConnected', 'true');
    
    // Clean up the URL to hide the parameter
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    window.location.href = '/login.html';
  }
}

export function redirectIfAuth() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true';
  if (isAuthenticated) {
    window.location.href = '/dashboard.html';
  }
}

export function handleSignOut() {
  const signOutBtns = document.querySelectorAll('.sign-out');
  signOutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isGithubConnected');
      window.location.href = '/login.html';
    });
  });
}
