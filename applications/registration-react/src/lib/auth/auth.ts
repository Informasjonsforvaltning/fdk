/* Facade for keycloak */
import Keycloak, { KeycloakInitOptions, KeycloakInstance } from 'keycloak-js';

export interface ResourceRole {
  resource: string;
  resourceId: string;
  role: string;
}

export interface OrganizationRole {
  orgNr: string;
  role: string;
}

export interface AuthConfiguration {
  oidcIssuer: string;
  clientId: string;
  redirectUri: string;
  logoutRedirectUri: string;
  silentCheckSsoRedirectUri?: string;
}

export interface User {
  username: string;
  name: string;
}

export class Auth {
  private readonly kc: KeycloakInstance<'native'>;

  constructor(private readonly conf: AuthConfiguration) {
    const [url, realm] = conf.oidcIssuer.split('/realms/');
    const kcConfig = { realm, url, clientId: conf.clientId };

    this.conf = conf;
    this.kc = Keycloak(kcConfig);
  }

  init: ({
    loginRequired
  }: {
    loginRequired: boolean;
  }) => Promise<boolean> = async ({ loginRequired }) => {
    const keycloakInitOptions: KeycloakInitOptions = {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: this.conf.silentCheckSsoRedirectUri,
      promiseType: 'native'
    };
    await this.kc.init(keycloakInitOptions).catch(console.error);
    if (loginRequired && !this.isAuthenticated()) {
      await this.login();
    }
    return this.isAuthenticated();
  };

  login: () => Promise<void> = () =>
    this.kc
      .login()
      .then()
      .catch(console.error);

  logout: () => Promise<void> = () =>
    this.kc
      .logout({ redirectUri: this.conf.logoutRedirectUri })
      .then()
      .catch(console.error);

  isAuthenticated: () => boolean = () => this.kc.authenticated || false;

  getUser: () => User | null = () =>
    this.kc.tokenParsed
      ? {
          username: (this.kc.tokenParsed as any).user_name,
          name: (this.kc.tokenParsed as any).name
        }
      : null;

  getToken: () => Promise<string> = () =>
    this.kc
      .updateToken(30)
      .catch(() => this.logout())
      .then(() => this.kc.token as string);

  getAuthorizationHeader: () => Promise<string> = async () =>
    `Bearer ${await this.getToken()}`;

  getAuthorities: () => string = () =>
    ((this.kc.tokenParsed &&
      (this.kc.tokenParsed as any).authorities) as string) || '';

  getResourceRoles: () => ResourceRole[] = () =>
    this.getAuthorities()
      .split(',')
      .map(authorityDescriptor => authorityDescriptor.split(':'))
      .map(([resource, resourceId, role]) => ({ resource, resourceId, role }));

  hasResourceRole: (resourceRole: ResourceRole) => boolean = ({
    resource,
    resourceId,
    role
  }) =>
    !!this.getResourceRoles().find(
      r =>
        r.resource === resource &&
        r.resourceId === resourceId &&
        r.role === role
    );

  hasOrganizationRole: (organizationRole: OrganizationRole) => boolean = ({
    orgNr,
    role
  }) =>
    this.hasResourceRole({ resource: 'organization', resourceId: orgNr, role });

  hasOrganizationReadPermission: (orgNr: string) => boolean = (orgNr: string) =>
    !!this.getResourceRoles().find(
      ({ resource, resourceId }) =>
        resource === 'organization' && resourceId === orgNr
    );

  hasOrganizationWritePermission = (orgNr: string) =>
    this.hasOrganizationRole({ orgNr, role: 'admin' });

  hasOrganizationAdminPermission = (orgNr: string) =>
    this.hasOrganizationRole({ orgNr, role: 'admin' });

  hasSystemAdminPermission = () =>
    this.hasResourceRole({
      resource: 'system',
      resourceId: 'root',
      role: 'admin'
    });
}
