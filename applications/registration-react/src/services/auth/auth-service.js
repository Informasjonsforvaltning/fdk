/* Facade for keycloak */
import _ from 'lodash';
import Keycloak from 'keycloak-js';
import { getConfig } from '../../config';

let kc;

const PERMISSION_READ = 'PERMISSION_READ';
const PERMISSION_ADMIN = 'PERMISSION_ADMIN';
const RESOURCE_ORGANIZATION = 'organization';
const ROLE_ADMIN = 'admin';

function toPromise(keycloakPromise) {
  return new Promise((resolve, reject) =>
    keycloakPromise.success(resolve).error(reject)
  );
}

export const isAuthenticated = () => kc && kc.authenticated;

export async function initAuthService() {
  const kcConfig = getConfig().keycloak;
  kc = Keycloak(kcConfig);

  return toPromise(kc.init({ onLoad: 'login-required' })).catch(err => {
    console.error(err);
    return false;
  });
}

export function logout() {
  kc.logout({ redirectUri: location.origin }); // redirects;
}

export function login() {
  kc.login(); // redirects
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
