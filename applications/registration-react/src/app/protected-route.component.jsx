import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';
import { selectUser } from '../redux/modules/user';
import { logout } from '../auth/auth-service';

export const ProtectedRoutePure = ({ user, ...props }) => {
  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Route {...props} />
      <IdleTimer
        element={document}
        onIdle={logout}
        timeout={27.5 * 60 * 1000}
        debounce={5000}
      />
    </>
  );
};

ProtectedRoutePure.defaultProps = {
  user: null,
  component: null
};

ProtectedRoutePure.propTypes = {
  user: PropTypes.object,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

function mapStateToProps(state) {
  return {
    user: selectUser(state)
  };
}

export const ProtectedRoute = connect(mapStateToProps)(ProtectedRoutePure);
