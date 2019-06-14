import React, { useState } from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';

import localization from '../lib/localization';
import { fetchUserIfNeeded } from '../actions/index';
import TimeoutModal from './timeout-modal/timeout-modal.component';

export const ProtectedRoutePure = props => {
  const {
    userItem,
    isFetchingUser,
    component: Component,
    history,
    dispatch
  } = props;

  const [showInactiveWarning, setShowInactiveWarning] = useState(false);

  const logOut = () => {
    setShowInactiveWarning(false);
    if (history) {
      history.push('/loggedOut');
    }
  };

  const refreshSession = () => {
    setShowInactiveWarning(false);
    dispatch(fetchUserIfNeeded());
  };

  return (
    <>
      {!isFetchingUser && !userItem && <Redirect to="/loggin" />}
      {userItem && <Route {...props} component={Component} />}
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
  userItem: null,
  history: null,
  isFetchingUser: false,
  component: null
};

ProtectedRoutePure.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userItem: PropTypes.object,
  history: PropTypes.object,
  isFetchingUser: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

function mapStateToProps({ user }) {
  const { userItem, isFetchingUser } = user || {
    userItem: null,
    isFetchingUser: false
  };
  return {
    userItem,
    isFetchingUser
  };
}

export const ProtectedRoute = withRouter(
  connect(mapStateToProps)(ProtectedRoutePure)
);
