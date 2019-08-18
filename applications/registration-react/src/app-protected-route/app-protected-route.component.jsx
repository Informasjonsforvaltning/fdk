import React, { useState } from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';

import localization from '../lib/localization';
import {
  getUserProfileThunk,
  selectIsFetching,
  selectUser
} from '../redux/modules/user';
import TimeoutModal from './timeout-modal/timeout-modal.component';
import { authService } from '../auth/auth-service';

export const ProtectedRoutePure = props => {
  const { user, isAuthenticating, component: Component, dispatch } = props;

  const [showInactiveWarning, setShowInactiveWarning] = useState(false);

  const logOut = async () => {
    setShowInactiveWarning(false);
    await authService.logout();
  };

  const refreshSession = () => {
    setShowInactiveWarning(false);
    dispatch(getUserProfileThunk());
  };

  if (isAuthenticating) {
    return null;
  }

  if (!user) {
    return <Redirect to="/loggin" />;
  }

  return (
    <>
      <Route {...props} component={Component} />
      <IdleTimer
        element={document}
        onIdle={() => setShowInactiveWarning(true)}
        timeout={27.5 * 60 * 1000} // gir idle warning etter 27,5 minutter
        debounce={5000}
      />
      <TimeoutModal
        modal={showInactiveWarning}
        toggle={logOut}
        refreshSession={refreshSession}
        title={localization.inactiveSessionWarning.title}
        ingress={localization.inactiveSessionWarning.loggingOut}
        body={localization.inactiveSessionWarning.stayLoggedIn}
        buttonConfirm={localization.inactiveSessionWarning.buttonStayLoggedIn}
        buttonLogout={localization.inactiveSessionWarning.buttonLogOut}
      />
    </>
  );
};

ProtectedRoutePure.defaultProps = {
  user: null,
  isAuthenticating: false,
  component: null
};

ProtectedRoutePure.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
  isAuthenticating: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

function mapStateToProps(state) {
  return {
    user: selectUser(state),
    isAuthenticating: selectIsFetching(state)
  };
}

export const ProtectedRoute = withRouter(
  connect(mapStateToProps)(ProtectedRoutePure)
);
