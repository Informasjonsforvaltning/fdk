import React from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';
import localization from '../../utils/localization';

const Header  = (props) => (
  <header>
    <div>
      <a
        id="focus-element"
        className="uu-invisible"
        href={`${location.pathname}#content`}
        aria-hidden="true"
      >
          Hopp til hovedinnhold
      </a>
    </div>
    <div id="skip-link-wrap">
      <a id="skip-link" href={`${location.pathname}#content`}>Hopp til hovedinnhold</a>
    </div>
    <div className="fdk-header-beta">
      {localization.beta.header}
      <br className="d-md-none" />
      {localization.beta.first}
      <a className="white-link" href="mailto:fellesdatakatalog@brreg.no">{localization.beta.second}</a> {localization.beta.last}
    </div>
    <div className="fdk-header">
      <div className="container">
        <div className="row">
          <div className="col-6 col-md-4">
            <a
              title="Link til Felles datakatalog"
              href="/"
            >
              <span className="uu-invisible" aria-hidden="false">Gå til forside</span>
              <img className="fdk-logo" src="/static/img/fdk-logo@2x.png" alt="Logo for Felles datakatalog" />
            </a>
          </div>

          <div className="col-6 col-md-offset-5 col-md-3" />
        </div>
      </div>
    </div>
  </header>
)

Header.defaultProps = {

};

Header.propTypes = {

};

export default Header;
