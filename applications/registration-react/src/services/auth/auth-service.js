/* Facade for keycloak */
import _ from 'lodash';
import Keycloak from 'keycloak-js';

import qs from 'qs';
import { getConfig } from '../config';
import { setLoginState } from './login-store';

let kc;

const PERMISSION_READ = 'PERMISSION_READ';
const PERMISSION_ADMIN = 'PERMISSION_ADMIN';
const RESOURCE_ORGANIZATION = 'organization';
const ROLE_ADMIN = 'admin';

const redirectPath = '/auth_response';
const loginPath = '/login';
const redirectUri = `${location.origin}${redirectPath}`;

function toPromise(keycloakPromise) {
  return new Promise((resolve, reject) =>
    keycloakPromise.success(resolve).error(reject)
  );
}

function initializeKeycloak() {
  const initOptions = {
    onLoad: 'check-sso',
    redirectUri
  };

  return toPromise(kc.init(initOptions));
}

export const isAuthenticated = () => kc && kc.authenticated;

function storeRedirectLocation() {
  // if redirectLocation is explicitly provided
  const query = qs.parse(location.search, { ignoreQueryPrefix: true }) || {};
  if (query.redirectLocation) {
    setLoginState({ redirectLocation: query.redirectLocation });
    return;
  }

  // exclude locations that don't need authentication
  const relativeLocation = location.href.substr(location.origin.length);
  if (
    !(
      relativeLocation.startsWith(loginPath) ||
      relativeLocation.startsWith(redirectPath)
    )
  ) {
    // redirectLocation is used in react-router redirect, that supports both string and object form
    setLoginState({ redirectLocation: relativeLocation });
  }
}

export async function initAuthService() {
  storeRedirectLocation();

  const kcConfig = getConfig().keycloak;
  kc = Keycloak(kcConfig);

  await initializeKeycloak();
}

export function logout(loginState) {
  if (loginState) {
    setLoginState(loginState);
  }
  kc.logout(); // redirects;
}

export function login({ readOnly = false }) {
  const idpHint = readOnly ? 'local-oidc' : 'idporten-oidc';
  kc.login({ idpHint }); // redirects
}

export async function getToken() {
  await toPromise(kc.updateToken(5)).catch(() => logout());
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
    case PERMISSION_READ: {
      return !!_.find(getResourceRoles(), {
        resource: RESOURCE_ORGANIZATION,
        resourceId
        // match any role
      });
    }
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

export const hasOrganizationReadPermission = resourceId => {
  return hasPermissionForResource(
    RESOURCE_ORGANIZATION,
    resourceId,
    PERMISSION_READ
  );
};

export const hasOrganizationAdminPermission = resourceId => {
  return hasPermissionForResource(
    RESOURCE_ORGANIZATION,
    resourceId,
    PERMISSION_ADMIN
  );
};
