import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logoutByTimeout } from '../services/auth/auth-service';
import { Timeout } from '../components/timeout.component';

const TIMEOUT = 27.5 * 60 * 1000;

export const ProtectedRoute = ({ check, ...props }) => {
  const {
    computedMatch: { params }
  } = props;

  if (!check(params)) {
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
  check: PropTypes.func.isRequired,
  computedMatch: PropTypes.object
};

ProtectedRoute.defaultProps = {
  computedMatch: {}
};
