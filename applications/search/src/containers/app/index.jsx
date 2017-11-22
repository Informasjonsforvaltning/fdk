import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { browserHistory } from 'react-router';

import localization from '../../components/localization';
import { addOrReplaceParam } from '../../utils/addOrReplaceUrlParam';
import { getLanguageFromUrl } from '../../utils/translateText';
import '../../assets/css/main.scss';

const getLangUrl = (langCode) => {
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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: `${localization.lang['norwegian-nb']}`,
      selectedLanguageCode: 'nb'
    };
    this.onChangeLanguage = this.onChangeLanguage.bind(this);
  }

  componentWillMount() {
    const langCode = getLanguageFromUrl();
    if (langCode !== null) {
      localization.setLanguage(langCode)
      const selectedLanguage = localization.lang[langCode]
      this.state = {
        selectedLanguage,
        selectedLanguageCode: langCode
      }
    }
  }

  onChangeLanguage(e) {
    const langCode = e;
    const langUrl = getLangUrl(langCode);
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

  render() {
    const langCode = getLanguageFromUrl();
    const langParam = langCode ? `?lang=${langCode}` : '';

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
                <a
                  title="Link til Felles datakatalog"
                  href={`/${langParam}`}
                >
                  <img className="fdk-logo" src="/static/img/fdk-logo@2x.png" alt="Logo for Felles datakatalog" />
                </a>
              </div>

              <div className="col-md-4">
                <p className="fdk-p-header-sub">
                  {localization.app.titleSub} {localization.app.readMore}
                  <a
                    title="Side om"
                    href={`/about${langParam}`}
                  >
                    {localization.app.title}
                  </a>
                </p>
              </div>

              <div className="col-sm-12 col-md-4 fdk-header-flex">
                <div className="fdk-btn-language-div">
                  <DropdownButton
                    tabIndex="0"
                    id="search-language-dropdown-1"
                    bsStyle="default"
                    className="fdk-button-language"
                    title={localization.lang.chosenLanguage}
                    onSelect={this.onChangeLanguage}
                  >
                    <MenuItem key="1" eventKey="nb">{localization.lang['norwegian-nb']}</MenuItem>
                    <MenuItem key="2" eventKey="nn">{localization.lang['norwegian-nn']}</MenuItem>
                    <MenuItem key="3" eventKey="en">{localization.lang['english-en']}</MenuItem>
                  </DropdownButton>
                </div>

                <DropdownButton
                  tabIndex="0"
                  id="search-menu-dropdown-1"
                  bsStyle="default"
                  className="fdk-button fdk-button-default fdk-button-on-white fdk-button-menu"
                  title={localization.app.menu}
                >
                  <MenuItem
                    key="menu-1"
                    eventKey="menu-1"
                    href="/about"
                  >
                    {localization.about.about}
                  </MenuItem>
                  <MenuItem
                    key="menu-2"
                    eventKey="menu-2"
                    href="/about-registration"
                  >
                    {localization.menu.aboutRegistration}
                  </MenuItem>
                </DropdownButton>
              </div>
            </div>
          </div>
        </div>
        <div className="fdk-container-path" />
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
                    href="mailto:fellesdatakatalog@brreg.no"
                  >
                    {localization.footer.contact}<br />
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
