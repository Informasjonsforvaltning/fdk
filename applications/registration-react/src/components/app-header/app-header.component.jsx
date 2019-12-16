import React from 'react';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';

import localization from '../../services/localization';
import './app-header.scss';
import { getUserProfile, logout } from '../../services/auth/auth-service';
import { getConfig } from '../../services/config';

export const AppHeaderPure = ({ user }) => {
  const logoImagePath = getConfig().useDemoLogo
    ? '/img/logo-registrering-demo.svg'
    : '/img/logo-registrering.svg';

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
                  src={logoImagePath}
                  alt="Logo for Felles datakatalog"
                />
              </a>
            </div>
            <div className="col-6 col-md-8 d-flex align-items-center fdk-header-text_items justify-content-end">
              {user && user.name && (
                <div className="mr-4">
                  <i className="fa fa-user fdk-fa-left fdk-color-primary" />
                  {user.name}
                </div>
              )}
              {user && (
                <div className="mr-4 fdk-auth-link">
                  <button
                    onClick={() => logout()}
                    type="button"
                    className="fdk-btn-no-border"
                  >
                    {localization.app.logOut}
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
  user: PropTypes.object
};

const enhance = compose(withProps(() => ({ user: getUserProfile() })));

export const AppHeader = enhance(AppHeaderPure);
