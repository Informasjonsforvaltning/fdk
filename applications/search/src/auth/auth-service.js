import Keycloak from 'keycloak-js';

import { getConfig } from '../config';

let kc;

const initOptions = {
  promiseType: 'native'
};

function init() {
  kc = Keycloak(getConfig().keycloak);

  return kc.init(initOptions);
}

function shouldSkipTrySsoSessionRecovery() {
  return localStorage.getItem('skipTrySsoSessionRecovery') === 'true';
}

function setSkipTrySsoSessionRecovery() {
  localStorage.setItem('skipTrySsoSessionRecovery', 'true');
}

function resetSsoSessionRecovery() {
  localStorage.removeItem('skipTrySsoSessionRecovery');
}

function getAuthenticated() {
  return kc.authenticated;
}

function logout(...args) {
  // do not make a flickering attempt to restore session from sso
  setSkipTrySsoSessionRecovery();
  return kc.logout(...args);
}

async function checkSession() {
  if (!getAuthenticated()) {
    throw new Error('Not logged in');
  }
}

async function getToken() {
  await checkSession();
  await kc.updateToken(5);
  return kc.token;
}

async function tryRestoreSsoSession() {
  if (getAuthenticated()) {
    resetSsoSessionRecovery();
  }
  // if browser does not have session, then make one attempt with promptless login, to check if sso has session
  // after this has been tried once, return with unauthenticated state.
  else if (!shouldSkipTrySsoSessionRecovery()) {
    setSkipTrySsoSessionRecovery();
    await kc.login({ prompt: 'none' });
  }

  return getAuthenticated();
}

async function getProfile() {
  await checkSession();
  return kc.profile || kc.loadUserProfile();
}

export const auth = {
  init,
  tryRestoreSsoSession,
  login: () => kc.login(),
  logout,
  getToken,
  getProfile,
  getAuthenticated
};
