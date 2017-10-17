import * as React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { browserHistory, Link } from 'react-router';

import localization from '../../components/localization';
import { addOrReplaceParam } from '../../utils/addOrReplaceUrlParam';
import './index.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: `${localization.lang['norwegian-nb']}`,
      selectedLanguageCode: 'nb'
    };
    this.onChangeLanguage = this.onChangeLanguage.bind(this);
    this.getLangUrl = this.getLangUrl.bind(this);
  }

  onChangeLanguage(e) {
    const langCode = e;
    const langUrl = this.getLangUrl(langCode);
    const nextUrl = `${location.pathname}${langUrl}`;
    browserHistory.push(nextUrl);

    let text;
    if (langCode === 'nb') {
      text = `${localization.lang['norwegian-nb']}`;
    } else if (langCode === 'nn') {
      text = `${localization.lang['norwegian-nn']}`;
    } else if (langCode === 'en') {
      text = `${localization.lang['english-en']}`;
    }
    this.setState({
      selectedLanguage: `${text}`,
      selectedLanguageCode: `${langCode}`
    });
    localization.setLanguage(langCode);
  }

  getLangUrl(langCode) {
    const href = window.location.search;
    const queryObj = qs.parse(window.location.search.substr(1));
    if (langCode === 'nb') {
      return addOrReplaceParam(href, 'lang', '');
    } else if (href.indexOf('lang=') === -1) {
      return href.indexOf('?') === -1 ? `${href}?lang=${langCode}` : `${href}&lang=${langCode}`;
    } else if (langCode !== queryObj.lang) {
      const replacedUrl = addOrReplaceParam(href, 'lang', langCode);
      return replacedUrl.substring(replacedUrl.indexOf('?'));
    }
    return href;
  }

  render() {
    // let queryObj = qs.parse(window.location.search.substr(1));
    // let language = queryObj.lang ? queryObj.lang : 'nb';
    const childWithProp =
      React.Children.map(this.props.children, child => React.cloneElement(child, {
        selectedLanguageCode: this.state.selectedLanguageCode
      }));
    return (
      <div>
        <div className="fdk-header-beta">
          {localization.beta.first}
          <a className="white-link" href="mailto:fellesdatakatalog@brreg.no">{localization.beta.second}</a> {localization.beta.last}
        </div>
        <div className="fdk-header">
          <div className="container">
            <div className="row">

              <div className="col-md-4">
                <Link to="/">
                  <img className="fdk-logo" src="/static/img/fdk-logo@2x.png" alt="Logo for Felles datakatalog" />
                </Link>
              </div>

              <div className="col-md-4">
                <p className="fdk-p-header-sub">
                  {localization.app.titleSub} {localization.app.readMore}
                  <a href="/about">
                    {localization.app.title}
                  </a>
                </p>
              </div>

              <div className="col-md-4 fdk-header-right">
                <div className="fdk-float-right">
                  <DropdownButton
                    id="search-menu-dropdown-1"
                    bsStyle="default"
                    className="dropdown-toggle fdk-button fdk-button-default fdk-button-on-white fdk-button-menu"
                    title={localization.app.menu}
                  >
                    <MenuItem
                      key="menu-1"
                      eventKey="menu-1"
                      href="/about">Om Felles Datakatalog</MenuItem>
                  </DropdownButton>
                </div>
                <div className="fdk-header-padding">
                  <div className="fdk-float-right fdk-margin-right-double">
                    <DropdownButton
                      id="search-language-dropdown-1"
                      bsStyle="default"
                      className="dropdown-toggle fdk-button-language"
                      title={localization.lang.chosenLanguage}
                      onSelect={this.onChangeLanguage}
                    >
                      <MenuItem key="1" eventKey="nb">{localization.lang['norwegian-nb']}</MenuItem>
                      <MenuItem key="2" eventKey="nn">{localization.lang['norwegian-nn']}</MenuItem>
                      <MenuItem key="3" eventKey="en">{localization.lang['english-en']}</MenuItem>
                    </DropdownButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {childWithProp}
        <div className="fdk-footer">
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
                <p className="fdk-p-footer">
                  {localization.footer.information_text}
                </p>
              </div>
              <div className="col-md-3 text-right">
                <p className="fdk-p-footer">
                  <a
                    href="mailto:felleskatalog@brreg.no"
                  >
                    <div>{localization.footer.contact}</div>
                    {localization.footer.mail}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired
};

