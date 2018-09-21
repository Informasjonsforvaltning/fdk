import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import { fetchUserIfNeeded } from '../../actions/index';
import localization from '../../utils/localization';
import '../../assets/style/bootstrap-override.scss';
import './styles';
import './app-header.scss';

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
    this.props.dispatch(fetchUserIfNeeded());
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    const { userItem } = this.props;
    return (
      <header>
        <div>
          <a
            id="focus-element"
            className="uu-invisible"
            href={`${location.pathname}#content`}
            aria-hidden="true"
          >
            {localization.app.skipLink}
          </a>
        </div>
        <div id="skip-link-wrap">
          <a id="skip-link" href={`${location.pathname}#content`}>
            {localization.app.skipLink}
          </a>
        </div>
        <div className="fdk-header">
          <div className="container">
            <div className="row">
              <div className="col-6 col-md-4">
                <a title="Link til Felles datakatalog" href="/">
                  <span className="uu-invisible" aria-hidden="false">
                    {localization.app.navigateFrontpage}
                  </span>
                  <img
                    className="fdk-logo"
                    src="/static/img/fdk-logo@2x.png"
                    alt="Logo for Felles datakatalog"
                  />
                </a>
              </div>

              <div className="col-6 col-md-4 d-flex justify-content-center align-items-center">
                <span>
                  <strong>{localization.app.title}</strong>
                </span>
              </div>
              <div className="col-md-4 d-flex align-items-center fdk-header-text_items justify-content-end">
                {userItem &&
                  userItem.name && (
                    <div className="mr-4">
                      <i className="fa fa-user fdk-fa-left fdk-color-cta3" />
                      {userItem.name}
                    </div>
                  )}
                {userItem && (
                  <div className="mr-4 fdk-auth-link">
                    <a href={`${window.location.origin}/logout`}>
                      {localization.app.logOut}
                    </a>
                  </div>
                )}
                {!userItem && (
                  <div className="mr-4 fdk-auth-link">
                    <a href={`${window.location.origin}/login`}>
                      {localization.app.logIn}
                    </a>
                  </div>
                )}

                <div>
                  <Dropdown
                    className="btn-group-default"
                    isOpen={this.state.dropdownOpen}
                    toggle={this.toggle}
                  >
                    <DropdownToggle
                      className="fdk-button fdk-button-menu"
                      caret
                      color="primary"
                    >
                      <span>{localization.menu.title}</span>
                    </DropdownToggle>
                    <DropdownMenu className="fdk-dropdownmenu">
                      <a
                        className="dropdown-item"
                        title="Veileder"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://doc.difi.no/data/veileder-for-beskrivelse-av-datasett/"
                      >
                        {localization.menu.guide}
                      </a>

                      <a
                        className="dropdown-item"
                        title="Standard"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://doc.difi.no/dcat-ap-no/"
                      >
                        {localization.menu.standard}
                      </a>
                      <a
                        className="dropdown-item"
                        title="Felles datakatalog"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://fellesdatakatalog.brreg.no"
                      >
                        {localization.menu.fdk}
                      </a>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

Header.defaultProps = {
  userItem: null
};

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userItem: PropTypes.object
};

function mapStateToProps({ user }) {
  const { userItem } = user || {
    userItem: null
  };

  return {
    userItem
  };
}

export default connect(mapStateToProps)(Header);
