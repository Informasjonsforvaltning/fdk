import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';
import { isAuthenticated, logoutByTimeout } from '../auth/auth-service';

export const ProtectedRoutePure = props => {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Route {...props} />
      <IdleTimer
        element={document}
        onIdle={logoutByTimeout}
        timeout={27.5 * 60 * 1000}
        debounce={5000}
      />
    </>
  );
};

export const ProtectedRoute = ProtectedRoutePure;
