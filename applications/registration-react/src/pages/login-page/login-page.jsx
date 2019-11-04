import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

import localization from '../../lib/localization';
import { login } from '../../auth/auth-service';
import './login-page.scss';

const showLoginReadOnly = window.localStorage.getItem('showLoginReadOnly');

export const LoginPagePure = ({ loggedOut }) => {
  return (
    <>
      <div className="login-dialog-wrapper pt-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {loggedOut && (
                <div
                  className="mt-2 alert alert-warning fdk-color-neutral-darkest"
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
            </div>
          </div>

          <div className="row">
            {showLoginReadOnly && (
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
            )}
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
};

LoginPagePure.defaultProps = {
  loggedOut: false
};

LoginPagePure.propTypes = {
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

export const LoginPage = connect(mapStateToProps)(LoginPagePure);
