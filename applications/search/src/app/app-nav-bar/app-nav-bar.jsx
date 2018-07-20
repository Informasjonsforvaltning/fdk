import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  UncontrolledDropdown, Nav, NavItem, NavLink
} from 'reactstrap';

import localization from '../../lib/localization';

export function AppNavBar(props) {
  return (
    <div className="fdk-header">
      <div className="container">
        <div className="container-fluid d-flex align-items-center">
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
          <div
            className="fdk-header-flex"
            style={{ 'flexGrow': '1', 'alignItems': 'center' }}
          >
            <Nav className="d-none d-lg-inline-flex">
              <NavItem>
                <NavLink href="/about">
                  {localization.about.about}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/about-registration">
                  {localization.menu.aboutRegistration}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/reports">
                  {localization.menu.reports}
                </NavLink>
              </NavItem>
            </Nav>

            <UncontrolledDropdown
              tabIndex="0"
              className="d-none d-lg-inline"
              >
              <DropdownToggle className="fdk-button-language"
                caret
              >
                {localization.lang.chosenLanguage}
              </DropdownToggle>
              <DropdownMenu right>

              <DropdownItem onClick={() => props.onChangeLanguage('nb')}
                >
                {localization.lang['norwegian-nb']}
              </DropdownItem>
              <DropdownItem onClick={() => props.onChangeLanguage('nn')}
              >

                {localization.lang['norwegian-nn']}
              </DropdownItem>
              <DropdownItem onClick={() => props.onChangeLanguage('en')}
              >
                {localization.lang['english-en']}
              </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

          <UncontrolledDropdown
            tabIndex="0"
            className="fdk-dropdown-menu d-inline d-lg-none"
          >
            <DropdownToggle
              className="fdk-button fdk-button-default fdk-button-menu"
              caret
            >
              {localization.app.menu}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <Link tabIndex="-1" to="/about">
                  {localization.about.about}
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link tabIndex="-1" to="/about-registration">
                  {localization.menu.aboutRegistration}
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link tabIndex="-1" to="/reports">
                  {localization.menu.reports}
                </Link>
              </DropdownItem>
              <DropdownItem
                onClick={() => props.onChangeLanguage('nb')}
              >
                {localization.lang['norwegian-nb']}
              </DropdownItem>
              <DropdownItem
                onClick={() => props.onChangeLanguage('nn')}
              >
                {localization.lang['norwegian-nn']}
              </DropdownItem>
              <DropdownItem
                onClick={() => props.onChangeLanguage('en')}
              >
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
  onChangeLanguage: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
};
