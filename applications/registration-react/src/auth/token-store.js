export const loadTokens = () => ({
  token: localStorage.getItem('auth-token'),
  refreshToken: localStorage.getItem('auth-refreshToken')
});

export const storeTokens = ({ token, refreshToken }) => {
  localStorage.setItem('auth-token', token);
  localStorage.setItem('auth-refreshToken', refreshToken);
};

export const removeTokens = () => {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('auth-refreshToken');
};
