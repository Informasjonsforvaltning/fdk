import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isAuthenticated, logoutByTimeout } from '../auth/auth-service';
import { Timeout } from './timeout.component';

const TIMEOUT = 27.5 * 60 * 1000;

export const ProtectedRoute = props => {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Route {...props} />
      <Timeout timeout={TIMEOUT} onTimeout={logoutByTimeout} />
    </>
  );
};
