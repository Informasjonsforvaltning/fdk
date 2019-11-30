import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import T from 'lodash/fp/T';

import { isAuthenticated, reauthenticateDueToTimeout, reauthenticateDueToUnauthenticated } from '../auth/auth-service';
import { Timeout } from './timeout.component';

const TIMEOUT = 27.5 * 60 * 1000;

export const ProtectedRoute = ({ check, ...props }) => {
  const {
    computedMatch: { params }
  } = props;

  if (!(isAuthenticated() && check(params))) {
    reauthenticateDueToUnauthenticated();
    return <Redirect to="/login" />; // render preemptively to reduce flicker
  }

  return (
    <>
      <Route {...props} />
      <Timeout timeout={TIMEOUT} onTimeout={reauthenticateDueToTimeout} />
    </>
  );
};

ProtectedRoute.propTypes = {
  check: PropTypes.func,
  computedMatch: PropTypes.object
};

ProtectedRoute.defaultProps = {
  check: T,
  computedMatch: {}
};
