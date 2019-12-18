import { getConfig } from '../../config';
import { Auth } from '../../lib/auth/auth';

export const authService = new Auth({
  oidcIssuer: getConfig().auth.oidcIssuer,
  clientId: getConfig().auth.oidcClientId,
  redirectUri: location.origin,
  logoutRedirectUri: getConfig().registrationHost,
  silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`
});

export default authService;
