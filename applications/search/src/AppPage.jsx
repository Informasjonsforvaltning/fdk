import * as React from 'react';
import PropTypes from 'prop-types';
import localization from './components/localization';
import qs from 'qs';

import "./index.scss";

export class App extends React.Component {

  render() {
    /*
     <div className="dropdown fdk-container-dropdown-language">
     <button className="btn btn-default fdk-dropdown-toggle-language" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
     <img className="fdk-dropdown-language-flag" src={language === 'en' ? 'img/flag-england.png' : 'img/flag-norway.png'}/>
     {language  === 'en' ? getText('lang.english-en') : ''}{language  === 'nn' ? getText('lang.norwegian-nn' : '') : ''}{language  === 'nb' ? getText('lang.norwegian-nb') : ''}
     <span className="caret"></span>
     </button>
     <ul className="dropdown-menu fdk-dropdown-language" aria-labelledby="dropdownMenu1">
     <li>
     <a href={getLangUrl('en')}><img className="fdk-dropdown-language-flag" src="img/flag-england.png"/>{getText('lang.english-en')}</a>
     </li>
     <li>
     <a href={getLangUrl('nb')}><img className="fdk-dropdown-language-flag" src="img/flag-norway.png"/>{getText('lang.norwegian-nb')}</a>
     </li>
     <li>
     <a href={getLangUrl('nn')}><img className="fdk-dropdown-language-flag" src="img/flag-norway.png"/>{getText('lang.norwegian-nn')}</a>
     </li>
     </ul>
     </div>
     */
    let queryObj = qs.parse(window.location.search.substr(1));
    let language = queryObj.lang ? queryObj.lang : 'nb';
    return (
      <div>
        <div className="fdk-header-beta">
          {localization.beta.first} <a className="white-link" href="mailto:fellesdatakatalog@brreg.no">{localization.beta.second}</a> {localization.beta.last}
        </div>
        <div className="fdk-header">
          <div className="container">
            <div className="row">
              <div className="col-md-5">
                <p className="fdk-p-header">
                    {localization.app.title}
                </p>
              </div>
              <div className="col-md-7 fdk-header-right">
                <a href="#">
                  <div className="fdk-button fdk-button-default fdk-button-on-white fdk-float-right">
                    <i className="fa fa-bars fdk-fa-dark fdk-fa-left"></i>
                    Menu
                  </div>
                </a>
                <div className="fdk-header-padding">
                  <div className="fdk-float-right fdk-margin-right-double">
                    <a href="#">
                      Språk her
                    </a>
                  </div>
                </div>
              </div>
              {false &&
              <div className="fdk-header-menu">
                <div className="dropdown fdk-container-dropdown-menu">
                  <div className="dropdown fdk-dropdown-toggle-menu">
                    <a data-toggle="dropdown" href="#">&#9776;</a>
                    <ul className="dropdown-menu fdk-dropdown-menu" role="menu" aria-labelledby="dLabel">
                      <li><a href="#">{localization.about.title}</a></li>
                      <li><a href="#">{localization.faq}</a></li>
                      <li><a href="https://doc.difi.no/dcat-ap-no/">{localization.about.standard}</a></li>
                      <li><a href="http://portal-fdk.tt1.brreg.no/coverage.html">{localization.about.status}</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              }
            </div>
            </div>
        </div>
        {this.props.children}
        <div className="fdk-footer">
          <div className="container">
            <div className="row">
              <div className="col-md-2">
                <a
                  href="#"
                >
                  {localization.footer.information}
                </a>
              </div>
              <div className="col-md-8">
                {localization.footer.information_text}
              </div>
              <div className="col-md-2 fdk-text-right">
                <a
                  href="mailto:felleskatalog@brreg.no"
                >
                  {localization.footer.mail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


App.propTypes = {
  children: PropTypes.node.isRequired,
};

