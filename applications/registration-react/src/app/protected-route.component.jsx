import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import T from 'lodash/fp/T';

import { isAuthenticated, logoutByTimeout } from '../auth/auth-service';
import { Timeout } from './timeout.component';

const TIMEOUT = 27.5 * 60 * 1000;

export const ProtectedRoute = ({ check, ...props }) => {
  const {
    computedMatch: { params }
  } = props;

  if (!(isAuthenticated() && check(params))) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Route {...props} />
      <Timeout timeout={TIMEOUT} onTimeout={logoutByTimeout} />
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
