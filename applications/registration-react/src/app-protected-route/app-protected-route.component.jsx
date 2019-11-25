import React, { useState } from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';

import localization from '../lib/localization';
import { selectUser } from '../redux/modules/user';
import TimeoutModal from './timeout-modal/timeout-modal.component';
import { logout } from '../auth/auth-service';

export const ProtectedRoutePure = props => {
  const { user, component: Component } = props;

  const [showInactiveWarning, setShowInactiveWarning] = useState(false);

  const onLogout = () => {
    setShowInactiveWarning(false);
    logout();
  };

  const refreshSession = () => {
    // token is automatically renewed by the auth-service, so here we just close the popup.
    setShowInactiveWarning(false);
  };

  if (!user) {
    return <Redirect to="/login" />;
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
        toggle={onLogout}
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
  component: null
};

ProtectedRoutePure.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

function mapStateToProps(state) {
  return {
    user: selectUser(state)
  };
}

export const ProtectedRoute = withRouter(
  connect(mapStateToProps)(ProtectedRoutePure)
);
