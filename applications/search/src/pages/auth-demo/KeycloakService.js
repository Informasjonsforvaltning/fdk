// http://localhost:8084/auth/js/keycloak.js
// const Keycloak = require('./keycloak'); // todo load from keycloak server

// todo do we need credentials here?
// is frontend client of its own or is the same fdk application part of fdk-api client
// do we have fdk-client and fdk-api or we have common fdk-application
// {
//     url: 'http://keycloak-server/auth',
//         realm: 'myrealm',
//     clientId: 'myapp'
// }
// const config = {
//     "realm": "demo",
//     "auth-server-url": "http://localhost:8084/auth",
//     "ssl-required": "external",
//     "resource": "fdk-application",
//     "verify-token-audience": true,
//     "credentials": {
//         "secret": "8f2e6c0c-e297-4a78-b5b2-2ac370966c86"
//     },
//     "confidential-port": 0,
//     "policy-enforcer": {}
// }
const config = {
  realm: 'demo',
  url: 'http://localhost:8084/auth',
  clientId: 'fdk-public'
  // "credentials": {
  //     "secret": "8f2e6c0c-e297-4a78-b5b2-2ac370966c86"
  // }
};

export class KeycloakService {
  static keycloakAuth = Keycloak(config);

  static init(options) {
    return new Promise((resolve, reject) => {
      KeycloakService.keycloakAuth
        .init(options)
        .success(() => {
          resolve();
        })
        .error(errorData => {
          reject(errorData);
        });
    });
  }

  authenticated() {
    return KeycloakService.keycloakAuth.authenticated;
  }

  login() {
    const loginOptions = {
      redirectUri: 'http://localhost:8080/authdemo'
    };
    KeycloakService.keycloakAuth.login(loginOptions);
  }

  logout() {
    KeycloakService.keycloakAuth.logout();
  }

  account() {
    KeycloakService.keycloakAuth.accountManagement();
  }

  tokenParsed() {
    return KeycloakService.keycloakAuth.tokenParsed;
  }

  getToken() {
    return new Promise((resolve, reject) => {
      if (KeycloakService.keycloakAuth.token) {
        KeycloakService.keycloakAuth
          .updateToken(5) // ensure minimum validity in minutes.
          .success(refreshed => {
            console.log('token refreshed:', refreshed);
            resolve(KeycloakService.keycloakAuth.token);
          })
          .error(() => {
            reject('Failed to refresh token');
          });
      } else {
        reject('Not loggen in');
      }
    });
  }

  getProfile() {
    return new Promise((resolve, reject) => {
      KeycloakService.keycloakAuth
        .loadUserProfile()
        .success(profile => {
          resolve(profile);
        })
        .error(() => {
          reject('Failed to load user profile');
        });
    });
  }
}
