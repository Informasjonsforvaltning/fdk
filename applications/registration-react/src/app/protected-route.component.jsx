import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

import { isAuthenticated, logout } from '../services/auth/auth-service';
import { Timeout } from '../components/timeout.component';

const TIMEOUT = 27.5 * 60 * 1000;

export const ProtectedRoute = ({ check, ...props }) => {
  const {
    computedMatch: { params }
  } = props;

  if (!(isAuthenticated() && check(params))) {
    logout();
    return <Redirect to="/login" />; // render preemptively to reduce flicker
  }

  return (
    <>
      <Route {...props} />
      <Timeout
        timeout={TIMEOUT}
        onTimeout={() => logout({ loggedOutDueToTimeout: true })}
      />
    </>
  );
};

ProtectedRoute.propTypes = {
  check: PropTypes.func,
  computedMatch: PropTypes.object
};

ProtectedRoute.defaultProps = {
  check: () => true,
  computedMatch: {}
};
