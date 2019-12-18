import React from 'react';
import { Route } from 'react-router-dom';

import { authService } from '../services/auth/auth-service';
import { Timeout } from '../components/timeout.component';

const TIMEOUT = 27.5 * 60 * 1000;

interface Props {
  check: (params: any) => boolean;
  computedMatch: any;
}

export const ProtectedRoute = ({ check, ...props }: Props) => {
  const {
    computedMatch: { params }
  } = props;

  if (!authService.isAuthenticated() || !check(params)) {
    authService.login();
    return null;
  }

  return (
    <>
      <Route {...props} />
      <Timeout timeout={TIMEOUT} onTimeout={() => authService.logout()} />
    </>
  );
};
