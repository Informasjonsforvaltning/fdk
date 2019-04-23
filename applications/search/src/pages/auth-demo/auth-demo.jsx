import axios from 'axios';

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
    this.setState({
      keycloakAuth: KeycloakService.keycloakAuth,
      tokenParsed: keycloakService.tokenParsed()
    });
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

  fetchSessionInfo() {
    axios
      .get('http://127.0.0.1:8121/demoapi/sessioninfo', {
        headers: { Authorization: `bearer ${this.state.keycloakAuth.token}` }
      })
      .then(r => r.data)
      .then(sessionInfo => this.setState({ sessionInfo }))
      .catch(console.log);
  }

  render() {
    return (
      <div>
        <button onClick={() => keycloakService.account()}>account</button>
        <button onClick={() => this.show()}>show</button>
        <button onClick={() => this.fetchProfile()}>fetch profile</button>
        <button onClick={() => this.fetchSessionInfo()}>sessioninfo</button>
        &nbsp;
        <button onClick={() => this.refresh()}>refresh token</button>
        <button onClick={() => keycloakService.login()}>login</button>
        <button onClick={() => keycloakService.logout()}>logout</button>
        <div>
          Token:
          <pre>{JSON.stringify(this.state.keycloakAuth, null, 2)}</pre>
          {/* <pre>{this.state.keycloakAuth.token}</pre> */}
          {/* <pre>{this.state.keycloakAuth.idToken}</pre> */}
          {/* <pre>{this.state.keycloakAuth.idTokenParsed}</pre> */}
          <pre>{JSON.stringify(this.state.tokenParsed, null, 2)}</pre>
          Profile
          <pre>{JSON.stringify(this.state.profile, null, 2)}</pre>
          SessionInfo
          <pre>{JSON.stringify(this.state.sessionInfo, null, 2)}</pre>
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
