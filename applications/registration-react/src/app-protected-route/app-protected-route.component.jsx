import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';

import localization from '../lib/localization';
import { fetchUserIfNeeded } from '../actions/index';
import TimeoutModal from './timeout-modal/timeout-modal.component';

export class ProtectedRoutePure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInactiveWarning: false
    };
    this.onIdle = this.onIdle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.refreshSession = this.refreshSession.bind(this);
  }

  onIdle() {
    this.setState({
      showInactiveWarning: true
    });
  }

  toggle() {
    this.setState({
      showInactiveWarning: false
    });
    window.location.href = `${window.location.origin}/loggedOut`;
  }

  refreshSession() {
    const { dispatch } = this.props;
    this.setState({
      showInactiveWarning: false
    });
    dispatch(fetchUserIfNeeded());
  }

  render() {
    const {
      userItem,
      isFetchingUser,
      component: Component,
      ...props
    } = this.props;
    const { showInactiveWarning } = this.state;
    return (
      <>
        {!isFetchingUser && (
          <Route
            {...props}
            render={props =>
              userItem && userItem.name !== '' ? (
                <Component {...props} />
              ) : (
                <Redirect {...props} to="/loggin" />
              )
            }
          />
        )}
        <IdleTimer
          element={document}
          onIdle={this.onIdle}
          timeout={27.5 * 60 * 1000} // gir idle warning etter 27,5 minutter
          debounce={5000}
        />
        <TimeoutModal
          modal={showInactiveWarning}
          toggle={this.toggle}
          refreshSession={this.refreshSession}
          title={localization.inactiveSessionWarning.title}
          ingress={localization.inactiveSessionWarning.loggingOut}
          body={localization.inactiveSessionWarning.stayLoggedIn}
          buttonConfirm={localization.inactiveSessionWarning.buttonStayLoggedIn}
          buttonLogout={localization.inactiveSessionWarning.buttonLogOut}
        />
      </>
    );
  }
}

ProtectedRoutePure.defaultProps = {
  userItem: null,
  isFetchingUser: false,
  component: null
};

ProtectedRoutePure.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userItem: PropTypes.object,
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

export const ProtectedRoute = connect(mapStateToProps)(ProtectedRoutePure);
