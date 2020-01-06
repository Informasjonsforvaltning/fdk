export const isNapProfile = napHosts =>
  (napHosts && napHosts.split(',').includes(window.location.hostname)) ||
  localStorage.getItem('napProfile');
