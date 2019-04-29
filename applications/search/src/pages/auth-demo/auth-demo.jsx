import axios from 'axios';
import React from 'react';
import { resolve } from 'react-resolver';

import { auth } from '../../auth/auth-service';

function AuthDemoPure(props) {
  const { authenticated, profile, token, sessionInfo } = props;
  return (
    <div>
      <button type="button" onClick={() => auth.login()}>
        login
      </button>
      <button type="button" onClick={() => auth.logout()}>
        logout
      </button>
      <div>
        Authenticated:
        <pre>{JSON.stringify(authenticated, null, 2)}</pre>
        Profile:
        <pre>{JSON.stringify(profile, null, 2)}</pre>
        Token:
        <pre>{token}</pre>
        Session info:
        <pre>{sessionInfo}</pre>
      </div>
    </div>
  );
}

async function fetchSessionInfo() {
  const token = await auth.getToken();
  const response = await axios.get(
    'http://127.0.0.1:8121/demoapi/sessioninfo',
    {
      headers: { Authorization: `bearer ${token}` }
    }
  );

  return response.data;
}

const mapProps = {
  // conceptItem: props => memoizedGetConcept(props.match.params.id)
  authenticated: () => auth.getAuthenticated(),
  profile: () => auth.getProfile().catch(reason => ({ reason })),
  token: () => auth.getToken().catch(reason => `error:${reason}`),
  sessionInfo: () => fetchSessionInfo().catch(reason => `error:${reason}`)
};

export const AuthDemo = resolve(mapProps)(AuthDemoPure);
