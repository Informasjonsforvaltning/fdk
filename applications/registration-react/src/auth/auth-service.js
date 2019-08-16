/* Facade for keycloak */
import _ from 'lodash';
import Keycloak from 'keycloak-js';

import { getConfig } from '../config';
import { loadTokens, removeTokens, storeTokens } from './token-store';

let kc;

function setOnAuthSuccess({ onAuthSuccess }) {
  const handler = () => {
    storeTokens({ token: kc.token, refreshToken: kc.refreshToken });

    if (typeof onAuthSuccess === 'function') {
      onAuthSuccess();
    }
  };

  kc.onAuthRefreshSuccess = handler;
  kc.onAuthSuccess = handler;
}

function setOnAuthError({ onAuthError }) {
  if (typeof onAuthError === 'function') {
    kc.onAuthError = onAuthError;
    kc.onAuthRefreshError = onAuthError;
  }
}

async function initialize() {
  const { token, refreshToken } = loadTokens();
  const initOptions = {
    promiseType: 'native',
    onLoad: 'check-sso',
    token,
    refreshToken
  };

  await kc.init(initOptions);
}

export async function configureAuth({ onAuthSuccess, onAuthError }) {
  const kcConfig = getConfig().keycloak;
  kc = Keycloak(kcConfig);

  setOnAuthSuccess({ onAuthSuccess });
  setOnAuthError({ onAuthError });

  await initialize();
}

export function logout() {
  removeTokens();
  return kc.logout({ redirectUri: `${window.location.origin}/loggedOut` });
}

export function login() {
  // TODO For "deep linking", we want to redirect to original selected location,
  //  but with current solution, ProtectedRoutePure component has already redireced to "/loggin".
  //  The original selected location has to be carried over to here.
  //  In addition, for deep linking, we need to handle the case when user does not have access to the resource in url.
  return kc.login({ redirectUri: window.location.origin });
}

export async function getToken() {
  await kc.updateToken(5);
  return kc.token;
}

export const getUserProfile = () => _.pick(kc.tokenParsed, 'name');
