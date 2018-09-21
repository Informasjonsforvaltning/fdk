import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';

import localization from '../utils/localization';
import { fetchUserIfNeeded } from '../actions/index';
import TimeoutModal from './timeout-modal/timeout-modal.component';

export class ProtectedRoute extends React.Component {
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
    this.setState({
      showInactiveWarning: false
    });
    this.props.dispatch(fetchUserIfNeeded());
  }

  render() {
    const {
      userItem,
      isFetchingUser,
      component: Component,
      ...props
    } = this.props;
    return (
      <IdleTimer
        element={document}
        idleAction={this.onIdle}
        timeout={27.5 * 60 * 1000} // gir idle warning etter 27,5 minutter
        format="DD.MM.YYYY HH:MM:ss.SSS"
      >
        <div className="container fdk-breadcrumb d-flex justify-content-between">
          <span />
          <span>{localization.app.autoSave}</span>
        </div>
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
        <TimeoutModal
          modal={this.state.showInactiveWarning}
          toggle={this.toggle}
          refreshSession={this.refreshSession}
          title={localization.inactiveSessionWarning.title}
          ingress={localization.inactiveSessionWarning.loggingOut}
          body={localization.inactiveSessionWarning.stayLoggedIn}
          buttonConfirm={localization.inactiveSessionWarning.buttonStayLoggedIn}
          buttonLogout={localization.inactiveSessionWarning.buttonLogOut}
        />
      </IdleTimer>
    );
  }
}

ProtectedRoute.defaultProps = {
  userItem: null,
  isFetchingUser: false,
  component: null
};

ProtectedRoute.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userItem: PropTypes.object,
  isFetchingUser: PropTypes.bool,
  component: PropTypes.func
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

export default connect(mapStateToProps)(ProtectedRoute);
