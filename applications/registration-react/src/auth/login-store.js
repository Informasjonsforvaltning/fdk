export const getLoginState = () => {
  const stateString = sessionStorage.getItem('login') || '{}';
  return JSON.parse(stateString);
};

export const setLoginState = patch => {
  const state = getLoginState() || {};
  Object.assign(state, patch);
  sessionStorage.setItem('login', JSON.stringify(state));
};

export const clearLoginState = () => {
  sessionStorage.removeItem('login');
};
