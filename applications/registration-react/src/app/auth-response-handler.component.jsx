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

  return <Redirect to={redirectLocation || defaultRedirect} />;
};

AuthResponseHandler.propTypes = {
  unAuthenticatedRedirect: PropTypes.string.isRequired,
  defaultRedirect: PropTypes.string.isRequired
};
