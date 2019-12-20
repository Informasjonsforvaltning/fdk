import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  UncontrolledDropdown,
  Nav,
  NavItem
} from 'reactstrap';

import localization from '../../lib/localization';
import {
  PATHNAME_REPORTS,
  PATHNAME_ABOUT,
  PATHNAME_ABOUT_REGISTRATION,
  PATHNAME_ABOUT_NAP,
  PATHNAME_HOME_NAP
} from '../../constants/constants';
import './app-nav-bar.scss';
import { getConfig } from '../../config';

export function AppNavBar(props) {
  const fdkLogoPath = getConfig().useDemoLogo
    ? 'fdk-logo-demo.svg'
    : 'fdk-logo@2x.png';

  return (
    <div className="fdk-header">
      <div className="container">
        <div className="row d-flex justify-content-between align-items-center">
          <div>
            <a
              title={
                getConfig().themeNap
                  ? localization.linkToNap
                  : localization.linkToFdk
              }
              href={getConfig().themeNap ? PATHNAME_HOME_NAP : '/'}
            >
              <span className="uu-invisible" aria-hidden="false">
                Gå til forside
              </span>
              <img
                className="fdk-logo"
                src={
                  getConfig().themeNap
                    ? '/img/logo-transport.svg'
                    : `/img/${fdkLogoPath}`
                }
                alt="Logo for Felles datakatalog"
              />
            </a>
          </div>
          <div>
            {!getConfig().themeNap && (
              <Nav className="d-none d-lg-inline-flex">
                <NavItem>
                  <Link className="nav-link" to={PATHNAME_ABOUT}>
                    {localization.menu.about}
                  </Link>
                </NavItem>
                <NavItem>
                  <Link className="nav-link" to={PATHNAME_ABOUT_REGISTRATION}>
                    {localization.menu.aboutRegistration}
                  </Link>
                </NavItem>
                <NavItem>
                  <Link className="nav-link" to={PATHNAME_REPORTS}>
                    {localization.menu.reports}
                  </Link>
                </NavItem>
              </Nav>
            )}
            {getConfig().themeNap && (
              <Nav className="d-none d-lg-inline-flex">
                <NavItem>
                  <a className="nav-link" href={PATHNAME_ABOUT_NAP}>
                    {localization.menu.aboutNap}
                  </a>
                </NavItem>
                <NavItem>
                  <Link className="nav-link" to={PATHNAME_ABOUT_REGISTRATION}>
                    {localization.menu.aboutRegistration}
                  </Link>
                </NavItem>
              </Nav>
            )}
          </div>
          <div>
            <UncontrolledDropdown className="d-none d-lg-inline">
              <DropdownToggle className="fdk-button-lang" caret>
                {localization.lang.chosenLanguage}
              </DropdownToggle>
              <DropdownMenu right className="fdk-dropdownmenu">
                <DropdownItem onClick={() => props.onChangeLanguage('nb')}>
                  {localization.lang['norwegian-nb']}
                </DropdownItem>
                <DropdownItem onClick={() => props.onChangeLanguage('nn')}>
                  {localization.lang['norwegian-nn']}
                </DropdownItem>
                <DropdownItem onClick={() => props.onChangeLanguage('en')}>
                  {localization.lang['english-en']}
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown
              tabIndex="0"
              className="fdk-dropdown-menu d-inline d-lg-none"
            >
              <DropdownToggle
                className="fdk-button fdk-button-menu"
                caret
                color="none"
              >
                {localization.app.menu}
              </DropdownToggle>
              {!getConfig().themeNap && (
                <DropdownMenu right className="fdk-dropdownmenu">
                  <Link className="dropdown-item" to={PATHNAME_ABOUT}>
                    {localization.about.about}
                  </Link>
                  <Link
                    className="dropdown-item"
                    to={PATHNAME_ABOUT_REGISTRATION}
                  >
                    {localization.menu.aboutRegistration}
                  </Link>
                  <Link className="dropdown-item" to={PATHNAME_REPORTS}>
                    {localization.menu.reports}
                  </Link>
                  <DropdownItem onClick={() => props.onChangeLanguage('nb')}>
                    {localization.lang['norwegian-nb']}
                  </DropdownItem>
                  <DropdownItem onClick={() => props.onChangeLanguage('nn')}>
                    {localization.lang['norwegian-nn']}
                  </DropdownItem>
                  <DropdownItem onClick={() => props.onChangeLanguage('en')}>
                    {localization.lang['english-en']}
                  </DropdownItem>
                </DropdownMenu>
              )}
              {getConfig().themeNap && (
                <DropdownMenu right className="fdk-dropdownmenu">
                  <Link className="dropdown-item" to={PATHNAME_ABOUT_NAP}>
                    {localization.menu.aboutNap}
                  </Link>
                  <Link
                    className="dropdown-item"
                    to={PATHNAME_ABOUT_REGISTRATION}
                  >
                    {localization.menu.aboutRegistration}
                  </Link>
                  <DropdownItem onClick={() => props.onChangeLanguage('nb')}>
                    {localization.lang['norwegian-nb']}
                  </DropdownItem>
                  <DropdownItem onClick={() => props.onChangeLanguage('nn')}>
                    {localization.lang['norwegian-nn']}
                  </DropdownItem>
                  <DropdownItem onClick={() => props.onChangeLanguage('en')}>
                    {localization.lang['english-en']}
                  </DropdownItem>
                </DropdownMenu>
              )}
            </UncontrolledDropdown>
          </div>
        </div>
      </div>
    </div>
  );
}

AppNavBar.defaultProps = {};

AppNavBar.propTypes = {
  onChangeLanguage: PropTypes.func.isRequired
};
