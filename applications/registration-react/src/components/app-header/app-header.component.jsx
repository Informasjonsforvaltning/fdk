import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router';

import localization from '../../lib/localization';
import './app-header.scss';
import { selectUser } from '../../redux/modules/user';
import { login, logout } from '../../auth/auth-service';

export const AppHeaderPure = ({ location, user }) => {
  let headerTitle;
  switch (location.pathname.split('/')[3]) {
    case 'datasets':
      headerTitle = localization.header['Registration of Datasets'];
      break;
    case 'apis':
      headerTitle = localization.header["Registration of API's"];
      break;
    default:
      headerTitle = localization.app.title;
  }

  const onClickLogout = e => {
    e.preventDefault();
    logout();
  };

  const onClickLogin = e => {
    e.preventDefault();
    login();
  };

  return (
    <header>
      <div>
        <a
          id="focus-element"
          className="uu-invisible"
          href={`${location.pathname}#content`}
          aria-hidden="true"
        >
          {localization.app.skipLink}
        </a>
      </div>
      <div id="skip-link-wrap">
        <a id="skip-link" href={`${location.pathname}#content`}>
          {localization.app.skipLink}
        </a>
      </div>
      <div className="fdk-header">
        <div className="container">
          <div className="row">
            <div className="col-6 col-md-4">
              <a title="Link til Felles datakatalog" href="/">
                <span className="uu-invisible" aria-hidden="false">
                  {localization.app.navigateFrontpage}
                </span>
                <img
                  className="fdk-logo"
                  src="/static/img/logo-registrering.svg"
                  alt="Logo for Felles datakatalog"
                />
              </a>
            </div>

            <div className="col-6 col-md-4 d-flex justify-content-center align-items-center">
              <span>
                <strong>{headerTitle}</strong>
              </span>
            </div>
            <div className="col-md-4 d-flex align-items-center fdk-header-text_items justify-content-end">
              {user &&
                user.name && (
                  <div className="mr-4">
                    <i className="fa fa-user fdk-fa-left fdk-color-primary" />
                    {user.name}
                  </div>
                )}
              {user && (
                <div className="mr-4 fdk-auth-link">
                  <button
                    onClick={onClickLogout}
                    className="fdk-btn-no-border"
                    type="button"
                  >
                    {localization.app.logOut}
                  </button>
                </div>
              )}
              {!user && (
                <div className="mr-4 fdk-auth-link">
                  <button
                    onClick={onClickLogin}
                    className="fdk-btn-no-border"
                    type="button"
                  >
                    {localization.app.logIn}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

AppHeaderPure.defaultProps = {
  user: null
};

AppHeaderPure.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ user: selectUser(state) });

const enhance = compose(
  withRouter,
  connect(mapStateToProps)
);

export const AppHeader = enhance(AppHeaderPure);
