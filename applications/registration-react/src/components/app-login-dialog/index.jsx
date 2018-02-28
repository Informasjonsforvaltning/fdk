import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import localization from '../../utils/localization';
import './index.scss';

//const LoginDialog = props => {
class LoginDialog extends React.Component {
  componentWillMount() {
    if(this.props.loggedOut) {
      return axios.get('/logout')
        .then((response) => response)
        .catch((response) => {
          const { error } = response;
          return Promise.reject(error);
        })

      return axios.get(
        '/logout'
      ).then((response) => {
      }).catch((error) => {
        throw {error}
      });
    }
  }
  render() {
    const {loggedOut} = this.props;
    return (
      <div className="login-dialog-wrapper p-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-8 offset-md-2">
              <div className="col-12 col-md-8">
                {loggedOut &&
                (
                  <div className="mt-2 alert alert-warning fdk-text-size-small fdk-color1" role="alert">
                    <span>
                      <strong>{localization.loginDialog.loggedOutMsgPart1}</strong>
                    </span>
                    <span>
                      {localization.loginDialog.loggedOutMsgPart2}
                    </span>
                  </div>
                )
                }
                {!loggedOut &&
                (
                  <div>
                    <h1 className="fdk-text-extra-strong mb-md-5">{localization.loginDialog.title}</h1>
                    <div className="fdk-text-size-medium fdk-text-line-medium mt-2 mb-md-3">
                      {localization.loginDialog.ingress}
                    </div>
                  </div>
                )
                }
                <a className="fdk-button fdk-button-cta mb-2 mb-md-5" href="/login">
                  {localization.app.logIn}
                </a>
                <div className="fdk-text-size-small fdk-text-line-medium">
                  <strong>{localization.catalogs.missingCatalogs.accessTitle}</strong>
                  <p>
                    {localization.catalogs.missingCatalogs.accessText}
                  </p>
                  <strong>{localization.catalogs.missingCatalogs.assignAccessTitle}</strong>
                  <p>
                    {localization.catalogs.missingCatalogs.assignAccessText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginDialog;
