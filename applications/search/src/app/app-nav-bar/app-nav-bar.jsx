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

export function AppNavBar(props) {
  return (
    <div className="fdk-header">
      <div className="container">
        <div className="row d-flex justify-content-between align-items-center">
          <div>
            <a title="Link til Felles datakatalog" href="/">
              <span className="uu-invisible" aria-hidden="false">
                Gå til forside
              </span>
              <img
                className="fdk-logo"
                src="/static/img/fdk-logo@2x.png"
                alt="Logo for Felles datakatalog"
              />
            </a>
          </div>
          <div>
            <Nav className="d-none d-lg-inline-flex">
              <NavItem>
                <Link className="nav-link" to="/about">
                  {localization.about.about}
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" to="/about-registration">
                  {localization.menu.aboutRegistration}
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" to="/reports">
                  {localization.menu.reports}
                </Link>
              </NavItem>
            </Nav>

            <UncontrolledDropdown className="d-none d-lg-inline">
              <DropdownToggle className="fdk-button-language" caret>
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
                color="primary"
              >
                {localization.app.menu}
              </DropdownToggle>
              <DropdownMenu right className="fdk-dropdownmenu">
                <Link className="dropdown-item" to="/about">
                  {localization.about.about}
                </Link>
                <Link className="dropdown-item" to="/about-registration">
                  {localization.menu.aboutRegistration}
                </Link>
                <Link className="dropdown-item" to="/reports">
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
