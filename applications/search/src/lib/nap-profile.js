export const isNapProfile = napHost =>
  window.location.hostname === napHost || localStorage.getItem('napProfile');
