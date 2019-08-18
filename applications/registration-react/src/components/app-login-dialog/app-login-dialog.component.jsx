import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

import localization from '../../lib/localization';
import { login } from '../../auth/auth-service';
import './app-login-dialog.scss';

export const LoginDialogPure = ({ loggedOut }) => {
  return (
    <div className="login-dialog-wrapper p-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="col-12 col-md-8">
              {loggedOut && (
                <div
                  className="mt-2 alert alert-warning fdk-text-size-small fdk-color-neutral-darkest"
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
                <Button className="fdk-button fdk-button-cta" onClick={login}>
                  {localization.app.logIn}
                </Button>
              </div>
              <div className="fdk-text-size-small fdk-text-line-medium">
                <strong>
                  {localization.catalogs.missingCatalogs.accessTitle}
                </strong>
                <p>
                  <a href="https://fellesdatakatalog.brreg.no/about-registration">
                    {localization.catalogs.missingCatalogs.accessText}
                    <i className="fa fa-external-link fdk-fa-right" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginDialogPure.defaultProps = {
  loggedOut: false
};

LoginDialogPure.propTypes = {
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

export const LoginDialog = connect(mapStateToProps)(LoginDialogPure);
