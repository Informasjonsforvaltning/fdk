export async function logout() {
  await fetch('/logout');
  window.location = '/loggedOut';
}

export function login() {
  window.location = '/login';
}

export async function getUserProfile() {
  const r = await fetch('/innloggetBruker', {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });
  return r.json();
}
