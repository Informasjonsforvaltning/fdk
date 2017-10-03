import * as React from 'react';
import PropTypes from 'prop-types';
import localization from '../../components/localization';
import qs from 'qs';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { browserHistory } from 'react-router';

import { addOrReplaceParam } from '../../utils/addOrReplaceUrlParam';
import './index.scss';

export class App extends React.Component {
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
    console.log(langUrl);
    const nextUrl = `${location.pathname}${langUrl}`;
    console.log(nextUrl);
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
    console.log(langCode);
    console.log(href);
    console.log(queryObj);
    if (langCode === 'nb') {
      return addOrReplaceParam(href, 'lang', '');
    } else if (href.indexOf('lang=') === -1) {
      return href.indexOf('?') === -1 ? `${href}?` + `lang=${langCode}` : `${href}&lang=${langCode}`;
    } else if (langCode !== queryObj.lang) {
      const replacedUrl = addOrReplaceParam(href, 'lang', langCode);
      return replacedUrl.substring(replacedUrl.indexOf('?'));
    }
    return href;
  }

  render() {
    // let queryObj = qs.parse(window.location.search.substr(1));
    // let language = queryObj.lang ? queryObj.lang : 'nb';
    const language = this.state.selectedLanguageCode;
    const childWithProp =
      React.Children.map(this.props.children, child => React.cloneElement(child, {
        selectedLanguageCode: this.state.selectedLanguageCode
      }));
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
                <p className="fdk-p-header-sub">
                  {localization.app.titleSub}
                </p>
              </div>
              <div className="col-md-7 fdk-header-right">
                <div className="fdk-float-right">
                  <DropdownButton
                    id="search-menu-dropdown-1"
                    bsStyle="default"
                    className="dropdown-toggle fdk-button fdk-button-default fdk-button-on-white fdk-button-menu"
                    title={localization.app.menu}
                  >
                    <MenuItem key="1" eventKey="1">Menypunkt 1</MenuItem>
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
              <div className="col-md-2">
                <a
                  href="https://www.brreg.no/personvernerklaering/"
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
  children: PropTypes.node.isRequired
};

