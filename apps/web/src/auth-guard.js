export function enforceAuth() {
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
