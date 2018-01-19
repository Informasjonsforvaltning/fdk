import React from 'react';
import PropTypes from 'prop-types';
//import cx from 'classnames';
import localization from '../../utils/localization';

const Footer  = (props) => {
  return (

      <footer className="fdk-footer">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <p className="fdk-p-footer">
                <a
                  href="https://www.brreg.no/personvernerklaering/"
                >
                  {localization.footer.information}<br />
                  {localization.footer.privacy}
                  <i className="fa fa-external-link fdk-fa-right" />
                </a>
              </p>
            </div>
            <div className="col-md-6 text-center">
              <span className="uu-invisible" aria-hidden="false">Felles Datakatalog.</span>
              <p className="fdk-p-footer">
                {localization.footer.information_text}
              </p>
            </div>
            <div className="col-md-3 text-right">
              <p className="fdk-p-footer">
                <a
                  href="mailto:fellesdatakatalog@brreg.no"
                >
                  <span className="uu-invisible" aria-hidden="false">Mailadresse.</span>
                  {localization.footer.contact}<br />
                  {localization.footer.mail}
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

  )
}

Footer.defaultProps = {

};

Footer.propTypes = {

};

export default Footer;
