import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { popLoginState } from '../services/auth/login-store';
import { isAuthenticated } from '../services/auth/auth-service';

export const AuthResponseHandler = ({
  unAuthenticatedRedirect,
  defaultRedirect
}) => {
  if (!isAuthenticated()) {
    return <Redirect to={unAuthenticatedRedirect} />;
  }

  const { redirectLocation } = popLoginState();

  // redirectLocation is absolute url
  if (
    typeof redirectLocation === 'string' &&
    redirectLocation.startsWith('http')
  ) {
    location.replace(redirectLocation);
    return null;
  }

  // redirectLocation is relative url or location object.
  if (redirectLocation) {
    return <Redirect to={redirectLocation} />;
  }

  return <Redirect to={defaultRedirect} />;
};

AuthResponseHandler.propTypes = {
  unAuthenticatedRedirect: PropTypes.string.isRequired,
  defaultRedirect: PropTypes.string.isRequired
};
