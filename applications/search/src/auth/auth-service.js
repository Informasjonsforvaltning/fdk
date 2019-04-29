import Keycloak from 'keycloak-js';

import { config } from '../config';

let kc;
let initPromise;

const initOptions = {
  promiseType: 'native'
};

function ensureInit() {
  if (initPromise) {
    return initPromise;
  }
  kc = Keycloak(config.keycloak);

  initPromise = kc.init(initOptions);
  return initPromise;
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
  await ensureInit();
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
  await ensureInit();
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
  init: ensureInit,
  tryRestoreSsoSession,
  login: () => kc.login(),
  logout,
  getToken,
  getProfile,
  getAuthenticated
};
