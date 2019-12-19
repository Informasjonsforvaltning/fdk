import React from 'react';

import localization from '../../services/localization';
import './app-footer.scss';

export const Footer = () => {
  let isRegistrationPage = false;

  // check if matches dataset registration page or api registration page
  if (
    /^\/catalogs\/[0-9a-z]+\/[apis\\datasets]+\/[0-9a-z-]+\/?$/.test(
      location.pathname
    )
  ) {
    isRegistrationPage = true;
  }

  return (
    <footer
      className="fdk-footer"
      style={{ marginBottom: isRegistrationPage ? '5em' : '0' }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <p className="fdk-p-footer">
              <a href="https://www.brreg.no/personvernerklaering/">
                {localization.footer.information}
                {localization.footer.privacy}
                <i className="fa fa-external-link fdk-fa-right" />
              </a>
            </p>
          </div>
          <div className="col-md-4 text-center">
            <span className="uu-invisible" aria-hidden="false">
              Felles Datakatalog.
            </span>
            <p className="fdk-p-footer">
              {localization.footer.information_text}
            </p>
          </div>
          <div className="col-md-4 text-right">
            <p className="fdk-p-footer">
              <a href="mailto:fellesdatakatalog@brreg.no">
                <span className="uu-invisible" aria-hidden="false">
                  Mailadresse.
                </span>
                {localization.footer.contact}
                {localization.footer.mail}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
