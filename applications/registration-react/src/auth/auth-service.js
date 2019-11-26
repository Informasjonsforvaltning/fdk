/* Facade for keycloak */
import _ from 'lodash';
import Keycloak from 'keycloak-js';

import { getConfig } from '../config';
import { loadTokens, removeTokens, storeTokens } from './token-store';
import { clearLoginState, setLoginState } from './login-store';

let kc;

const PERMISSION_ADMIN = 'PERMISSION_ADMIN';
const RESOURCE_ORGANIZATION = 'organization';
const ROLE_ADMIN = 'admin';

function setOnAuthSuccess() {
  const handler = () => {
    clearLoginState();
    storeTokens({ token: kc.token, refreshToken: kc.refreshToken });
  };

  kc.onAuthRefreshSuccess = handler;
  kc.onAuthSuccess = handler;
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

export async function initAuth() {
  const kcConfig = getConfig().keycloak;
  kc = Keycloak(kcConfig);

  setOnAuthSuccess();

  await initialize();
}

export function logout() {
  removeTokens();
  return kc.logout();
}

export function logoutByTimeout() {
  setLoginState({ loggedOutDueToTimeout: true });
  logout();
}

export function login({ readOnly = false }) {
  // TODO For "deep linking", we want to redirect to original selected location,
  //  but with current solution, ProtectedRoutePure component has already redireced to "/login".
  //  The original selected location has to be carried over to here.
  //  In addition, for deep linking, we need to handle the case when user does not have access to the resource in url.
  const idpHint = readOnly ? 'local-oidc' : 'idporten-oidc';
  kc.login({ redirectUri: window.location.origin, idpHint });
}

export const isAuthenticated = () => kc && kc.authenticated;

export async function getToken() {
  await kc.updateToken(5);
  return kc.token;
}

export const getUserProfile = () =>
  isAuthenticated() ? _.pick(kc.tokenParsed, 'name') : null;

const extractResourceRoles = authorities => {
  return (authorities || '')
    .split(',')
    .map(authorityDescriptor => authorityDescriptor.split(':'))
    .map(parts => ({
      resource: parts[0],
      resourceId: parts[1],
      role: parts[2]
    }));
};

export const getResourceRoles = () => {
  if (!(kc && kc.tokenParsed)) {
    return null;
  }
  return extractResourceRoles(_.get(kc.tokenParsed, 'authorities'));
};

const hasPermissionForResource = (resource, resourceId, permission) => {
  switch (permission) {
    case PERMISSION_ADMIN: {
      return !!_.find(getResourceRoles(), {
        resource: RESOURCE_ORGANIZATION,
        resourceId,
        role: ROLE_ADMIN
      });
    }
    default: {
      throw new Error('no permission');
    }
  }
};

export const hasOrganizationAdminPermission = resourceId => {
  return hasPermissionForResource(
    RESOURCE_ORGANIZATION,
    resourceId,
    PERMISSION_ADMIN
  );
};
