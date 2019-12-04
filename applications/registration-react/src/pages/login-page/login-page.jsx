import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { withProps } from 'recompose';

import localization from '../../services/localization';
import { login } from '../../services/auth/auth-service';
import './login-page.scss';
import { getLoginState } from '../../services/auth/login-store';

const renderMessageForLoggedOutDueToTimeout = () => (
  <div className="row">
    <div className="col-12">
      <div
        className="mt-2 alert alert-warning fdk-color-neutral-darkest"
        role="alert"
      >
        <span>
          <strong>{localization.loginDialog.loggedOutMsgPart1}</strong>
        </span>
        <span>{localization.loginDialog.loggedOutMsgPart2}</span>
      </div>
    </div>
  </div>
);

export const LoginPagePure = ({ loggedOutDueToTimeout }) => (
  <>
    <div className="login-dialog-wrapper pt-5">
      <div className="container">
        {loggedOutDueToTimeout && renderMessageForLoggedOutDueToTimeout()}
        <div className="row">
          <div className="col-md-6">
            <div className="jumbotron jumbotron-login h-100">
              <h2>{localization.app.loginPage.readUser.heading}</h2>
              <Button
                className="fdk-button fdk-button-cta fdk-bg-color-link mt-4"
                onClick={() => login({ readOnly: true })}
              >
                {localization.app.loginPage.readUser.loginButton}
              </Button>
              <p>{localization.app.loginPage.readUser.description1}</p>
              <div>
                <strong>
                  {localization.app.loginPage.readUser.description2}
                </strong>
                <p>
                  {localization.app.loginPage.readUser.description3.click}{' '}
                  <strong>
                    {localization.app.loginPage.readUser.loginButton}
                  </strong>
                  , {localization.app.loginPage.readUser.description3.then}{' '}
                  <strong>
                    {
                      localization.app.loginPage.readUser.description3
                        .registerUser
                    }
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mt-5 mt-md-0">
            <div className="jumbotron jumbotron-login h-100">
              <h2>{localization.app.loginPage.writeUser.heading}</h2>
              <Button
                className="fdk-button fdk-button-cta fdk-bg-color-link mt-4"
                onClick={login}
              >
                {localization.app.loginPage.writeUser.loginButton}
              </Button>
              <p className="">
                {localization.app.loginPage.writeUser.description1}
              </p>
              <div>
                <strong>
                  {localization.app.loginPage.writeUser.description2}
                </strong>
                <p>
                  <a href="https://fellesdatakatalog.brreg.no/about-registration">
                    {localization.app.loginPage.writeUser.description3}
                  </a>
                </p>
                <p />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 ml-4 mt-4">
            <div>
              <strong>{localization.app.loginPage.postamble1}</strong>
              <p>
                {localization.app.loginPage.postamble2}
                <br />
                {localization.app.loginPage.postamble3}{' '}
                <a href="https://fellesdatakatalog.brreg.no/about-registration">
                  {localization.app.loginPage.postamble4}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

LoginPagePure.defaultProps = {
  loggedOutDueToTimeout: false
};

LoginPagePure.propTypes = {
  loggedOutDueToTimeout: PropTypes.bool
};

export const LoginPage = withProps(getLoginState)(LoginPagePure);
