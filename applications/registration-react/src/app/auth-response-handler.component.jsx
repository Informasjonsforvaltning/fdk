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

  popLoginState();

  return <Redirect to={defaultRedirect} />;
};

AuthResponseHandler.propTypes = {
  unAuthenticatedRedirect: PropTypes.string.isRequired,
  defaultRedirect: PropTypes.object.isRequired
};
