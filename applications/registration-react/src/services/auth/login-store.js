export const getLoginState = () => {
  const valueString = sessionStorage.getItem('login');
  try {
    const parsed = JSON.parse(valueString);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    return {};
  }
};

export const setLoginState = value => {
  const valueString = JSON.stringify({ ...value });
  sessionStorage.setItem('login', valueString);
};

const clearLoginState = () => {
  sessionStorage.removeItem('login');
};

export const popLoginState = () => {
  const state = getLoginState();
  clearLoginState();
  return state;
};
