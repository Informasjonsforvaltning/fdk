async function logout() {
  await fetch('/logout');
}

function login() {
  window.location = '/login';
}

async function getUserProfile() {
  const r = await fetch('/innloggetBruker', {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });
  return r.json();
}

export const authService = {
  login,
  getUserProfile,
  logout
};
