import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import { resetUser } from '../../actions/index';
import localization from '../../utils/localization';
import './index.scss';

// const LoginDialog = props => {
export class LoginDialog extends React.Component {
  componentWillMount() {
    if (this.props.loggedOut) {
      axios
        .get('/logout')
        .then(() => {
          this.props.dispatch(resetUser());
        })
        .catch(() => {
          this.props.dispatch(resetUser());
        });
    }
  }
  render() {
    const { loggedOut } = this.props;
    return (
      <div className="login-dialog-wrapper p-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="col-12 col-md-8">
                {loggedOut && (
                  <div
                    className="mt-2 alert alert-warning fdk-text-size-small fdk-color1"
                    role="alert"
                  >
                    <span>
                      <strong>
                        {localization.loginDialog.loggedOutMsgPart1}
                      </strong>
                    </span>
                    <span>{localization.loginDialog.loggedOutMsgPart2}</span>
                  </div>
                )}
                {!loggedOut && (
                  <div>
                    <h1 className="fdk-text-extra-strong mb-md-5">
                      {localization.loginDialog.title}
                    </h1>
                    <div className="fdk-text-size-medium fdk-text-line-medium mt-2 mb-md-3">
                      {localization.loginDialog.ingress}
                    </div>
                  </div>
                )}
                <div className="mt-5 mb-5">
                  <a className="fdk-button fdk-button-cta" href="/login">
                    {localization.app.logIn}
                  </a>
                </div>
                <div className="fdk-text-size-small fdk-text-line-medium">
                  <strong>
                    {localization.catalogs.missingCatalogs.accessTitle}
                  </strong>
                  <p>{localization.catalogs.missingCatalogs.accessText}</p>
                  <strong>
                    {localization.catalogs.missingCatalogs.assignAccessTitle}
                  </strong>
                  <p>
                    {localization.catalogs.missingCatalogs.assignAccessText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LoginDialog.defaultProps = {
  loggedOut: false
};

LoginDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loggedOut: PropTypes.bool
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

export default connect(mapStateToProps)(LoginDialog);
