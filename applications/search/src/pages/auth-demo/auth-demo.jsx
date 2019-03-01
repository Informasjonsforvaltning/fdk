// app code, men module level skulle v're ok

import { KeycloakService } from './KeycloakService';
import React from 'react';

const keycloakService = new KeycloakService();

KeycloakService.init({ onLoad: 'check-sso', checkLoginIframeInterval: 1 }).then(
  () => {
    console.log('keycloak init complete, proceed');
    // todo ensure initialized
  }
);

export class AuthDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  show() {
    this.setState({ tokenParsed: keycloakService.tokenParsed() });
  }

  fetchProfile() {
    keycloakService.getProfile().then(profile => {
      console.log('got profile', profile);
      this.setState({ profile });
    });
  }
  refresh() {
    keycloakService.getToken().then(token => {
      console.log('got token', token);
      this.setState({ token });
    });
  }

  render() {
    return (
      <div>
        <button onClick={() => keycloakService.account()}>account</button>
        <button onClick={() => this.show()}>show</button>
        <button onClick={() => this.fetchProfile()}>fetch profile</button>

        <button onClick={() => this.refresh()}>refresh token</button>

        <button onClick={() => keycloakService.login()}>login</button>
        <button onClick={() => keycloakService.logout()}>logout</button>
        <div>
          Token:
          <pre>{this.state.token}</pre>
          <pre>{JSON.stringify(this.state.tokenParsed, null, 2)}</pre>
          Profile
          <pre>{JSON.stringify(this.state.profile, null, 2)}</pre>
        </div>
      </div>
    );

    // show token
    // initiate login
    // initiate logout
    // ? periodisk oppdatering av token
    // initiate refresh
    // account page link
  }
}
