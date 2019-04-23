/*
 * Copyright 2016 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(window, undefined) {
  var Keycloak = function(config) {
    if (!(this instanceof Keycloak)) {
      return new Keycloak(config);
    }

    const kc = this;
    let adapter;
    const refreshQueue = [];
    let callbackStorage;

    const loginIframe = {
      enable: true,
      callbackList: [],
      interval: 5
    };

    kc.init = function(initOptions) {
      kc.authenticated = false;
      console.log('init options', initOptions);
      callbackStorage = createCallbackStorage();

      if (initOptions && initOptions.adapter === 'cordova') {
        adapter = loadAdapter('cordova');
      } else if (initOptions && initOptions.adapter === 'default') {
        adapter = loadAdapter();
      } else if (window.Cordova) {
        adapter = loadAdapter('cordova');
      } else {
        adapter = loadAdapter();
      }

      if (initOptions) {
        if (typeof initOptions.checkLoginIframe !== 'undefined') {
          loginIframe.enable = initOptions.checkLoginIframe;
        }

        if (initOptions.checkLoginIframeInterval) {
          loginIframe.interval = initOptions.checkLoginIframeInterval;
        }

        if (initOptions.onLoad === 'login-required') {
          kc.loginRequired = true;
        }

        if (initOptions.responseMode) {
          if (
            initOptions.responseMode === 'query' ||
            initOptions.responseMode === 'fragment'
          ) {
            kc.responseMode = initOptions.responseMode;
          } else {
            throw 'Invalid value for responseMode';
          }
        }

        if (initOptions.flow) {
          switch (initOptions.flow) {
            case 'standard':
              kc.responseType = 'code';
              break;
            case 'implicit':
              kc.responseType = 'id_token token';
              break;
            case 'hybrid':
              kc.responseType = 'code id_token token';
              break;
            default:
              throw 'Invalid value for flow';
          }
          kc.flow = initOptions.flow;
        }

        if (initOptions.timeSkew != null) {
          kc.timeSkew = initOptions.timeSkew;
        }
      }

      if (!kc.responseMode) {
        kc.responseMode = 'fragment';
      }
      if (!kc.responseType) {
        kc.responseType = 'code';
        kc.flow = 'standard';
      }

      const promise = createPromise();

      const initPromise = createPromise();
      initPromise.promise
        .success(() => {
          kc.onReady && kc.onReady(kc.authenticated);
          promise.setSuccess(kc.authenticated);
        })
        .error(errorData => {
          promise.setError(errorData);
        });

      const configPromise = loadConfig(config);

      function onLoad() {
        const doLogin = function(prompt) {
          if (!prompt) {
            options.prompt = 'none';
          }
          kc.login(options)
            .success(() => {
              initPromise.setSuccess();
            })
            .error(() => {
              initPromise.setError();
            });
        };

        var options = {};
        switch (initOptions.onLoad) {
          case 'check-sso':
            console.log('is check-sso');
            if (loginIframe.enable) {
              console.log('loginiframeennabled');

              setupCheckLoginIframe().success(() => {
                checkLoginIframe()
                  .success(() => {
                    console.log('iframe set up, doing login');

                    doLogin(false);
                    console.log('logindone');
                  })
                  .error(() => {
                    initPromise.setSuccess();
                  });
              });
            } else {
              doLogin(false);
            }
            break;
          case 'login-required':
            doLogin(true);
            break;
          default:
            throw 'Invalid value for onLoad';
        }
      }

      function processInit() {
        const callback = parseCallback(window.location.href);

        if (callback) {
          setupCheckLoginIframe();
          window.history.replaceState({}, null, callback.newUrl);
          processCallback(callback, initPromise);
        } else if (initOptions) {
          if (initOptions.refreshToken) {
            setToken(
              initOptions.token,
              initOptions.refreshToken,
              initOptions.idToken
            );

            if (loginIframe.enable) {
              setupCheckLoginIframe().success(() => {
                checkLoginIframe()
                  .success(() => {
                    kc.onAuthSuccess && kc.onAuthSuccess();
                    initPromise.setSuccess();
                  })
                  .error(() => {
                    setToken(null, null, null);
                    initPromise.setSuccess();
                  });
              });
            } else {
              kc.updateToken(-1)
                .success(() => {
                  kc.onAuthSuccess && kc.onAuthSuccess();
                  initPromise.setSuccess();
                })
                .error(() => {
                  kc.onAuthError && kc.onAuthError();
                  if (initOptions.onLoad) {
                    onLoad();
                  } else {
                    initPromise.setError();
                  }
                });
            }
          } else if (initOptions.onLoad) {
            onLoad();
          } else {
            initPromise.setSuccess();
          }
        } else {
          initPromise.setSuccess();
        }
      }

      configPromise.success(processInit);
      configPromise.error(() => {
        promise.setError();
      });

      return promise.promise;
    };

    kc.login = function(options) {
      return adapter.login(options);
    };

    kc.createLoginUrl = function(options) {
      const state = createUUID();
      const nonce = createUUID();

      const redirectUri = adapter.redirectUri(options);

      const callbackState = {
        state,
        nonce,
        redirectUri: encodeURIComponent(redirectUri)
      };

      if (options && options.prompt) {
        callbackState.prompt = options.prompt;
      }

      callbackStorage.add(callbackState);

      let action = 'auth';
      if (options && options.action == 'register') {
        action = 'registrations';
      }

      const scope =
        options && options.scope ? `openid ${options.scope}` : 'openid';

      let url = `${getRealmUrl()}/protocol/openid-connect/${action}?client_id=${encodeURIComponent(
        kc.clientId
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=${encodeURIComponent(state)}&nonce=${encodeURIComponent(
        nonce
      )}&response_mode=${encodeURIComponent(
        kc.responseMode
      )}&response_type=${encodeURIComponent(
        kc.responseType
      )}&scope=${encodeURIComponent(scope)}`;

      if (options && options.prompt) {
        url += `&prompt=${encodeURIComponent(options.prompt)}`;
      }

      if (options && options.maxAge) {
        url += `&max_age=${encodeURIComponent(options.maxAge)}`;
      }

      if (options && options.loginHint) {
        url += `&login_hint=${encodeURIComponent(options.loginHint)}`;
      }

      if (options && options.idpHint) {
        url += `&kc_idp_hint=${encodeURIComponent(options.idpHint)}`;
      }

      if (options && options.locale) {
        url += `&ui_locales=${encodeURIComponent(options.locale)}`;
      }

      return url;
    };

    kc.logout = function(options) {
      return adapter.logout(options);
    };

    kc.createLogoutUrl = function(options) {
      const url =
        `${getRealmUrl()}/protocol/openid-connect/logout` +
        `?redirect_uri=${encodeURIComponent(
          adapter.redirectUri(options, false)
        )}`;

      return url;
    };

    kc.register = function(options) {
      return adapter.register(options);
    };

    kc.createRegisterUrl = function(options) {
      if (!options) {
        options = {};
      }
      options.action = 'register';
      return kc.createLoginUrl(options);
    };

    kc.createAccountUrl = function(options) {
      const url =
        `${getRealmUrl()}/account` +
        `?referrer=${encodeURIComponent(
          kc.clientId
        )}&referrer_uri=${encodeURIComponent(adapter.redirectUri(options))}`;

      return url;
    };

    kc.accountManagement = function() {
      return adapter.accountManagement();
    };

    kc.hasRealmRole = function(role) {
      const access = kc.realmAccess;
      return !!access && access.roles.indexOf(role) >= 0;
    };

    kc.hasResourceRole = function(role, resource) {
      if (!kc.resourceAccess) {
        return false;
      }

      const access = kc.resourceAccess[resource || kc.clientId];
      return !!access && access.roles.indexOf(role) >= 0;
    };

    kc.loadUserProfile = function() {
      const url = `${getRealmUrl()}/account`;
      const req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.setRequestHeader('Accept', 'application/json');
      req.setRequestHeader('Authorization', `bearer ${kc.token}`);

      const promise = createPromise();

      req.onreadystatechange = function() {
        if (req.readyState == 4) {
          if (req.status == 200) {
            kc.profile = JSON.parse(req.responseText);
            promise.setSuccess(kc.profile);
          } else {
            promise.setError();
          }
        }
      };

      req.send();

      return promise.promise;
    };

    kc.loadUserInfo = function() {
      const url = `${getRealmUrl()}/protocol/openid-connect/userinfo`;
      const req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.setRequestHeader('Accept', 'application/json');
      req.setRequestHeader('Authorization', `bearer ${kc.token}`);

      const promise = createPromise();

      req.onreadystatechange = function() {
        if (req.readyState == 4) {
          if (req.status == 200) {
            kc.userInfo = JSON.parse(req.responseText);
            promise.setSuccess(kc.userInfo);
          } else {
            promise.setError();
          }
        }
      };

      req.send();

      return promise.promise;
    };

    kc.isTokenExpired = function(minValidity) {
      if (!kc.tokenParsed || (!kc.refreshToken && kc.flow != 'implicit')) {
        throw 'Not authenticated';
      }

      if (kc.timeSkew == null) {
        console.info(
          '[KEYCLOAK] Unable to determine if token is expired as timeskew is not set'
        );
        return true;
      }

      let expiresIn =
        kc.tokenParsed.exp -
        Math.ceil(new Date().getTime() / 1000) +
        kc.timeSkew;
      if (minValidity) {
        expiresIn -= minValidity;
      }
      return expiresIn < 0;
    };

    kc.updateToken = function(minValidity) {
      const promise = createPromise();

      if (!kc.refreshToken) {
        promise.setError();
        return promise.promise;
      }

      minValidity = minValidity || 5;

      const exec = function() {
        let refreshToken = false;
        if (minValidity == -1) {
          refreshToken = true;
          console.info('[KEYCLOAK] Refreshing token: forced refresh');
        } else if (!kc.tokenParsed || kc.isTokenExpired(minValidity)) {
          refreshToken = true;
          console.info('[KEYCLOAK] Refreshing token: token expired');
        }

        if (!refreshToken) {
          promise.setSuccess(false);
        } else {
          let params = `${'grant_type=refresh_token&' + 'refresh_token='}${
            kc.refreshToken
          }`;
          const url = `${getRealmUrl()}/protocol/openid-connect/token`;

          refreshQueue.push(promise);

          if (refreshQueue.length == 1) {
            const req = new XMLHttpRequest();
            req.open('POST', url, true);
            req.setRequestHeader(
              'Content-type',
              'application/x-www-form-urlencoded'
            );
            req.withCredentials = true;

            if (kc.clientId && kc.clientSecret) {
              req.setRequestHeader(
                'Authorization',
                `Basic ${btoa(`${kc.clientId}:${kc.clientSecret}`)}`
              );
            } else {
              params += `&client_id=${encodeURIComponent(kc.clientId)}`;
            }

            let timeLocal = new Date().getTime();

            req.onreadystatechange = function() {
              if (req.readyState == 4) {
                if (req.status == 200) {
                  console.info('[KEYCLOAK] Token refreshed');

                  timeLocal = (timeLocal + new Date().getTime()) / 2;

                  const tokenResponse = JSON.parse(req.responseText);

                  setToken(
                    tokenResponse.access_token,
                    tokenResponse.refresh_token,
                    tokenResponse.id_token,
                    timeLocal
                  );

                  kc.onAuthRefreshSuccess && kc.onAuthRefreshSuccess();
                  for (
                    var p = refreshQueue.pop();
                    p != null;
                    p = refreshQueue.pop()
                  ) {
                    p.setSuccess(true);
                  }
                } else {
                  console.warn('[KEYCLOAK] Failed to refresh token');

                  kc.onAuthRefreshError && kc.onAuthRefreshError();
                  for (
                    var p = refreshQueue.pop();
                    p != null;
                    p = refreshQueue.pop()
                  ) {
                    p.setError(true);
                  }
                }
              }
            };

            req.send(params);
          }
        }
      };

      if (loginIframe.enable) {
        const iframePromise = checkLoginIframe();
        iframePromise
          .success(() => {
            exec();
          })
          .error(() => {
            promise.setError();
          });
      } else {
        exec();
      }

      return promise.promise;
    };

    kc.clearToken = function() {
      if (kc.token) {
        setToken(null, null, null);
        kc.onAuthLogout && kc.onAuthLogout();
        if (kc.loginRequired) {
          kc.login();
        }
      }
    };

    function getRealmUrl() {
      if (kc.authServerUrl.charAt(kc.authServerUrl.length - 1) == '/') {
        return `${kc.authServerUrl}realms/${encodeURIComponent(kc.realm)}`;
      }
      return `${kc.authServerUrl}/realms/${encodeURIComponent(kc.realm)}`;
    }

    function getOrigin() {
      if (!window.location.origin) {
        return `${window.location.protocol}//${window.location.hostname}${
          window.location.port ? `:${window.location.port}` : ''
        }`;
      }
      return window.location.origin;
    }

    function processCallback(oauth, promise) {
      const code = oauth.code;
      const error = oauth.error;
      const prompt = oauth.prompt;

      let timeLocal = new Date().getTime();

      if (error) {
        if (prompt != 'none') {
          const errorData = {
            error,
            error_description: oauth.error_description
          };
          kc.onAuthError && kc.onAuthError(errorData);
          promise && promise.setError(errorData);
        } else {
          promise && promise.setSuccess();
        }
        return;
      } else if (
        kc.flow != 'standard' &&
        (oauth.access_token || oauth.id_token)
      ) {
        authSuccess(oauth.access_token, null, oauth.id_token, true);
      }

      if (kc.flow != 'implicit' && code) {
        let params = `code=${code}&grant_type=authorization_code`;
        const url = `${getRealmUrl()}/protocol/openid-connect/token`;

        const req = new XMLHttpRequest();
        req.open('POST', url, true);
        req.setRequestHeader(
          'Content-type',
          'application/x-www-form-urlencoded'
        );

        if (kc.clientId && kc.clientSecret) {
          req.setRequestHeader(
            'Authorization',
            `Basic ${btoa(`${kc.clientId}:${kc.clientSecret}`)}`
          );
        } else {
          params += `&client_id=${encodeURIComponent(kc.clientId)}`;
        }

        params += `&redirect_uri=${oauth.redirectUri}`;

        req.withCredentials = true;

        req.onreadystatechange = function() {
          if (req.readyState == 4) {
            if (req.status == 200) {
              const tokenResponse = JSON.parse(req.responseText);
              authSuccess(
                tokenResponse.access_token,
                tokenResponse.refresh_token,
                tokenResponse.id_token,
                kc.flow === 'standard'
              );
            } else {
              kc.onAuthError && kc.onAuthError();
              promise && promise.setError();
            }
          }
        };

        req.send(params);
      }

      function authSuccess(accessToken, refreshToken, idToken, fulfillPromise) {
        timeLocal = (timeLocal + new Date().getTime()) / 2;

        setToken(accessToken, refreshToken, idToken, timeLocal);

        if (
          (kc.tokenParsed && kc.tokenParsed.nonce != oauth.storedNonce) ||
          (kc.refreshTokenParsed &&
            kc.refreshTokenParsed.nonce != oauth.storedNonce) ||
          (kc.idTokenParsed && kc.idTokenParsed.nonce != oauth.storedNonce)
        ) {
          console.info('[KEYCLOAK] Invalid nonce, clearing token');
          kc.clearToken();
          promise && promise.setError();
        } else if (fulfillPromise) {
          kc.onAuthSuccess && kc.onAuthSuccess();
          promise && promise.setSuccess();
        }
      }
    }

    function loadConfig(url) {
      const promise = createPromise();
      let configUrl;

      if (!config) {
        configUrl = 'keycloak.json';
      } else if (typeof config === 'string') {
        configUrl = config;
      }

      if (configUrl) {
        const req = new XMLHttpRequest();
        req.open('GET', configUrl, true);
        req.setRequestHeader('Accept', 'application/json');

        req.onreadystatechange = function() {
          if (req.readyState == 4) {
            if (req.status == 200) {
              const config = JSON.parse(req.responseText);

              kc.authServerUrl = config['auth-server-url'];
              kc.realm = config.realm;
              kc.clientId = config.resource;
              kc.clientSecret = (config.credentials || {}).secret;

              promise.setSuccess();
            } else {
              promise.setError();
            }
          }
        };

        req.send();
      } else {
        if (!config.url) {
          const scripts = document.getElementsByTagName('script');
          for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src.match(/.*keycloak\.js/)) {
              config.url = scripts[i].src.substr(
                0,
                scripts[i].src.indexOf('/js/keycloak.js')
              );
              break;
            }
          }
        }

        if (!config.realm) {
          throw 'realm missing';
        }

        if (!config.clientId) {
          throw 'clientId missing';
        }

        kc.authServerUrl = config.url;
        kc.realm = config.realm;
        kc.clientId = config.clientId;
        kc.clientSecret = (config.credentials || {}).secret;

        promise.setSuccess();
      }

      return promise.promise;
    }

    function setToken(token, refreshToken, idToken, timeLocal) {
      if (kc.tokenTimeoutHandle) {
        clearTimeout(kc.tokenTimeoutHandle);
        kc.tokenTimeoutHandle = null;
      }

      if (refreshToken) {
        kc.refreshToken = refreshToken;
        kc.refreshTokenParsed = decodeToken(refreshToken);
      } else {
        delete kc.refreshToken;
        delete kc.refreshTokenParsed;
      }

      if (idToken) {
        kc.idToken = idToken;
        kc.idTokenParsed = decodeToken(idToken);
      } else {
        delete kc.idToken;
        delete kc.idTokenParsed;
      }

      if (token) {
        kc.token = token;
        kc.tokenParsed = decodeToken(token);
        kc.sessionId = kc.tokenParsed.session_state;
        kc.authenticated = true;
        kc.subject = kc.tokenParsed.sub;
        kc.realmAccess = kc.tokenParsed.realm_access;
        kc.resourceAccess = kc.tokenParsed.resource_access;

        if (timeLocal) {
          kc.timeSkew = Math.floor(timeLocal / 1000) - kc.tokenParsed.iat;
        }

        if (kc.timeSkew != null) {
          console.info(
            `[KEYCLOAK] Estimated time difference between browser and server is ${
              kc.timeSkew
            } seconds`
          );

          if (kc.onTokenExpired) {
            const expiresIn =
              (kc.tokenParsed.exp - new Date().getTime() / 1000 + kc.timeSkew) *
              1000;
            console.info(
              `[KEYCLOAK] Token expires in ${Math.round(expiresIn / 1000)} s`
            );
            if (expiresIn <= 0) {
              kc.onTokenExpired();
            } else {
              kc.tokenTimeoutHandle = setTimeout(kc.onTokenExpired, expiresIn);
            }
          }
        }
      } else {
        delete kc.token;
        delete kc.tokenParsed;
        delete kc.subject;
        delete kc.realmAccess;
        delete kc.resourceAccess;

        kc.authenticated = false;
      }
    }

    function decodeToken(str) {
      str = str.split('.')[1];

      str = str.replace('/-/g', '+');
      str = str.replace('/_/g', '/');
      switch (str.length % 4) {
        case 0:
          break;
        case 2:
          str += '==';
          break;
        case 3:
          str += '=';
          break;
        default:
          throw 'Invalid token';
      }

      str = `${str}===`.slice(0, str.length + (str.length % 4));
      str = str.replace(/-/g, '+').replace(/_/g, '/');

      str = decodeURIComponent(escape(atob(str)));

      str = JSON.parse(str);
      return str;
    }

    function createUUID() {
      const s = [];
      const hexDigits = '0123456789abcdef';
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = '4';
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      s[8] = s[13] = s[18] = s[23] = '-';
      const uuid = s.join('');
      return uuid;
    }

    kc.callback_id = 0;

    function createCallbackId() {
      const id = `<id: ${kc.callback_id++}${Math.random()}>`;
      return id;
    }

    function parseCallback(url) {
      const oauth = new CallbackParser(url, kc.responseMode).parseUri();
      const oauthState = callbackStorage.get(oauth.state);

      if (
        oauthState &&
        (oauth.code || oauth.error || oauth.access_token || oauth.id_token)
      ) {
        oauth.redirectUri = oauthState.redirectUri;
        oauth.storedNonce = oauthState.nonce;
        oauth.prompt = oauthState.prompt;

        if (oauth.fragment) {
          oauth.newUrl += `#${oauth.fragment}`;
        }

        return oauth;
      }
    }

    function createPromise() {
      var p = {
        setSuccess(result) {
          p.success = true;
          p.result = result;
          if (p.successCallback) {
            p.successCallback(result);
          }
        },

        setError(result) {
          p.error = true;
          p.result = result;
          if (p.errorCallback) {
            p.errorCallback(result);
          }
        },

        promise: {
          success(callback) {
            if (p.success) {
              callback(p.result);
            } else if (!p.error) {
              p.successCallback = callback;
            }
            return p.promise;
          },
          error(callback) {
            if (p.error) {
              callback(p.result);
            } else if (!p.success) {
              p.errorCallback = callback;
            }
            return p.promise;
          }
        }
      };
      return p;
    }

    function setupCheckLoginIframe() {
      const promise = createPromise();

      if (!loginIframe.enable) {
        promise.setSuccess();
        return promise.promise;
      }

      if (loginIframe.iframe) {
        promise.setSuccess();
        return promise.promise;
      }

      const iframe = document.createElement('iframe');
      loginIframe.iframe = iframe;

      iframe.onload = function() {
        const realmUrl = getRealmUrl();
        if (realmUrl.charAt(0) === '/') {
          loginIframe.iframeOrigin = getOrigin();
        } else {
          loginIframe.iframeOrigin = realmUrl.substring(
            0,
            realmUrl.indexOf('/', 8)
          );
        }
        promise.setSuccess();

        setTimeout(check, loginIframe.interval * 1000);
      };

      const src = `${getRealmUrl()}/protocol/openid-connect/login-status-iframe.html`;
      iframe.setAttribute('src', src);
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const messageCallback = function(event) {
        if (
          event.origin !== loginIframe.iframeOrigin ||
          loginIframe.iframe.contentWindow !== event.source
        ) {
          return;
        }

        if (
          !(
            event.data == 'unchanged' ||
            event.data == 'changed' ||
            event.data == 'error'
          )
        ) {
          return;
        }

        if (event.data != 'unchanged') {
          kc.clearToken();
        }

        const callbacks = loginIframe.callbackList.splice(
          0,
          loginIframe.callbackList.length
        );

        for (let i = callbacks.length - 1; i >= 0; --i) {
          const promise = callbacks[i];
          if (event.data == 'unchanged') {
            promise.setSuccess();
          } else {
            promise.setError();
          }
        }
      };

      window.addEventListener('message', messageCallback, false);

      var check = function() {
        checkLoginIframe();
        if (kc.token) {
          setTimeout(check, loginIframe.interval * 1000);
        }
      };

      return promise.promise;
    }

    function checkLoginIframe() {
      const promise = createPromise();

      if (loginIframe.iframe && loginIframe.iframeOrigin) {
        const msg = `${kc.clientId} ${kc.sessionId}`;
        loginIframe.callbackList.push(promise);
        const origin = loginIframe.iframeOrigin;
        if (loginIframe.callbackList.length == 1) {
          loginIframe.iframe.contentWindow.postMessage(msg, origin);
        }
      } else {
        promise.setSuccess();
      }

      return promise.promise;
    }

    function loadAdapter(type) {
      if (!type || type == 'default') {
        return {
          login(options) {
            window.location.href = kc.createLoginUrl(options);
            return createPromise().promise;
          },

          logout(options) {
            window.location.href = kc.createLogoutUrl(options);
            return createPromise().promise;
          },

          register(options) {
            window.location.href = kc.createRegisterUrl(options);
            return createPromise().promise;
          },

          accountManagement() {
            window.location.href = kc.createAccountUrl();
            return createPromise().promise;
          },

          redirectUri(options, encodeHash) {
            if (arguments.length == 1) {
              encodeHash = true;
            }

            if (options && options.redirectUri) {
              return options.redirectUri;
            } else if (kc.redirectUri) {
              return kc.redirectUri;
            }
            let redirectUri = location.href;
            if (location.hash && encodeHash) {
              redirectUri = redirectUri.substring(
                0,
                location.href.indexOf('#')
              );
              redirectUri += `${
                redirectUri.indexOf('?') == -1 ? '?' : '&'
              }redirect_fragment=${encodeURIComponent(
                location.hash.substring(1)
              )}`;
            }
            return redirectUri;
          }
        };
      }

      if (type == 'cordova') {
        loginIframe.enable = false;

        return {
          login(options) {
            const promise = createPromise();

            let o = 'location=no';
            if (options && options.prompt == 'none') {
              o += ',hidden=yes';
            }

            const loginUrl = kc.createLoginUrl(options);
            const ref = window.open(loginUrl, '_blank', o);

            let completed = false;

            ref.addEventListener('loadstart', event => {
              if (event.url.indexOf('http://localhost') == 0) {
                const callback = parseCallback(event.url);
                processCallback(callback, promise);
                ref.close();
                completed = true;
              }
            });

            ref.addEventListener('loaderror', event => {
              if (!completed) {
                if (event.url.indexOf('http://localhost') == 0) {
                  const callback = parseCallback(event.url);
                  processCallback(callback, promise);
                  ref.close();
                  completed = true;
                } else {
                  promise.setError();
                  ref.close();
                }
              }
            });

            return promise.promise;
          },

          logout(options) {
            const promise = createPromise();

            const logoutUrl = kc.createLogoutUrl(options);
            const ref = window.open(
              logoutUrl,
              '_blank',
              'location=no,hidden=yes'
            );

            let error;

            ref.addEventListener('loadstart', event => {
              if (event.url.indexOf('http://localhost') == 0) {
                ref.close();
              }
            });

            ref.addEventListener('loaderror', event => {
              if (event.url.indexOf('http://localhost') == 0) {
                ref.close();
              } else {
                error = true;
                ref.close();
              }
            });

            ref.addEventListener('exit', event => {
              if (error) {
                promise.setError();
              } else {
                kc.clearToken();
                promise.setSuccess();
              }
            });

            return promise.promise;
          },

          register() {
            const registerUrl = kc.createRegisterUrl();
            const ref = window.open(registerUrl, '_blank', 'location=no');
            ref.addEventListener('loadstart', event => {
              if (event.url.indexOf('http://localhost') == 0) {
                ref.close();
              }
            });
          },

          accountManagement() {
            const accountUrl = kc.createAccountUrl();
            const ref = window.open(accountUrl, '_blank', 'location=no');
            ref.addEventListener('loadstart', event => {
              if (event.url.indexOf('http://localhost') == 0) {
                ref.close();
              }
            });
          },

          redirectUri(options) {
            return 'http://localhost';
          }
        };
      }

      throw `invalid adapter type: ${type}`;
    }

    var LocalStorage = function() {
      if (!(this instanceof LocalStorage)) {
        return new LocalStorage();
      }

      localStorage.setItem('kc-test', 'test');
      localStorage.removeItem('kc-test');

      const cs = this;

      function clearExpired() {
        const time = new Date().getTime();
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.indexOf('kc-callback-') == 0) {
            const value = localStorage.getItem(key);
            if (value) {
              try {
                const expires = JSON.parse(value).expires;
                if (!expires || expires < time) {
                  localStorage.removeItem(key);
                }
              } catch (err) {
                localStorage.removeItem(key);
              }
            }
          }
        }
      }

      cs.get = function(state) {
        if (!state) {
          return;
        }

        const key = `kc-callback-${state}`;
        let value = localStorage.getItem(key);
        if (value) {
          localStorage.removeItem(key);
          value = JSON.parse(value);
        }

        clearExpired();
        return value;
      };

      cs.add = function(state) {
        clearExpired();

        const key = `kc-callback-${state.state}`;
        state.expires = new Date().getTime() + 60 * 60 * 1000;
        localStorage.setItem(key, JSON.stringify(state));
      };
    };

    var CookieStorage = function() {
      if (!(this instanceof CookieStorage)) {
        return new CookieStorage();
      }

      const cs = this;

      cs.get = function(state) {
        if (!state) {
          return;
        }

        const value = getCookie(`kc-callback-${state}`);
        setCookie(`kc-callback-${state}`, '', cookieExpiration(-100));
        if (value) {
          return JSON.parse(value);
        }
      };

      cs.add = function(state) {
        setCookie(
          `kc-callback-${state.state}`,
          JSON.stringify(state),
          cookieExpiration(60)
        );
      };

      cs.removeItem = function(key) {
        setCookie(key, '', cookieExpiration(-100));
      };

      var cookieExpiration = function(minutes) {
        const exp = new Date();
        exp.setTime(exp.getTime() + minutes * 60 * 1000);
        return exp;
      };

      var getCookie = function(key) {
        const name = `${key}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return '';
      };

      var setCookie = function(key, value, expirationDate) {
        const cookie =
          `${key}=${value}; ` + `expires=${expirationDate.toUTCString()}; `;
        document.cookie = cookie;
      };
    };

    function createCallbackStorage() {
      try {
        return new LocalStorage();
      } catch (err) {}

      return new CookieStorage();
    }

    var CallbackParser = function(uriToParse, responseMode) {
      if (!(this instanceof CallbackParser)) {
        return new CallbackParser(uriToParse, responseMode);
      }
      const parser = this;

      const initialParse = function() {
        let baseUri = null;
        let queryString = null;
        let fragmentString = null;

        const questionMarkIndex = uriToParse.indexOf('?');
        let fragmentIndex = uriToParse.indexOf('#', questionMarkIndex + 1);
        if (questionMarkIndex == -1 && fragmentIndex == -1) {
          baseUri = uriToParse;
        } else if (questionMarkIndex != -1) {
          baseUri = uriToParse.substring(0, questionMarkIndex);
          queryString = uriToParse.substring(questionMarkIndex + 1);
          if (fragmentIndex != -1) {
            fragmentIndex = queryString.indexOf('#');
            fragmentString = queryString.substring(fragmentIndex + 1);
            queryString = queryString.substring(0, fragmentIndex);
          }
        } else {
          baseUri = uriToParse.substring(0, fragmentIndex);
          fragmentString = uriToParse.substring(fragmentIndex + 1);
        }

        return {
          baseUri,
          queryString,
          fragmentString
        };
      };

      const parseParams = function(paramString) {
        const result = {};
        const params = paramString.split('&');
        for (let i = 0; i < params.length; i++) {
          const p = params[i].split('=');
          const paramName = decodeURIComponent(p[0]);
          const paramValue = decodeURIComponent(p[1]);
          result[paramName] = paramValue;
        }
        return result;
      };

      const handleQueryParam = function(paramName, paramValue, oauth) {
        const supportedOAuthParams = [
          'code',
          'state',
          'error',
          'error_description'
        ];

        for (let i = 0; i < supportedOAuthParams.length; i++) {
          if (paramName === supportedOAuthParams[i]) {
            oauth[paramName] = paramValue;
            return true;
          }
        }
        return false;
      };

      parser.parseUri = function() {
        const parsedUri = initialParse();

        let queryParams = {};
        if (parsedUri.queryString) {
          queryParams = parseParams(parsedUri.queryString);
        }

        const oauth = { newUrl: parsedUri.baseUri };
        for (var param in queryParams) {
          switch (param) {
            case 'redirect_fragment':
              oauth.fragment = queryParams[param];
              break;
            default:
              if (
                responseMode != 'query' ||
                !handleQueryParam(param, queryParams[param], oauth)
              ) {
                oauth.newUrl += `${(oauth.newUrl.indexOf('?') == -1
                  ? '?'
                  : '&') + param}=${queryParams[param]}`;
              }
              break;
          }
        }

        if (responseMode === 'fragment') {
          let fragmentParams = {};
          if (parsedUri.fragmentString) {
            fragmentParams = parseParams(parsedUri.fragmentString);
          }
          for (var param in fragmentParams) {
            oauth[param] = fragmentParams[param];
          }
        }

        return oauth;
      };
    };
  };

  if (
    typeof module === 'object' &&
    module &&
    typeof module.exports === 'object'
  ) {
    module.exports = Keycloak;
  } else {
    window.Keycloak = Keycloak;

    if (typeof define === 'function' && define.amd) {
      define('keycloak', [], () => Keycloak);
    }
  }
})(window);
