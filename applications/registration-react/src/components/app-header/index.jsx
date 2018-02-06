import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import {
  fetchUserIfNeeded
} from '../../actions/index';
import localization from '../../utils/localization';
import './index.scss';

class Header extends React.Component {
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

              <div className="col-6 col-md-4 d-flex justify-content-center align-items-center">
                <span><strong>Registrering</strong></span>
              </div>
              <div className="col-md-4 d-flex align-items-center fdk-header-text_items justify-content-end">
                {userItem && userItem.name &&
                  <div className="fdk-margin-right-double">
                    <i className="fa fa-user fdk-fa-left fdk-color-cta3" />
                    {userItem.name}
                  </div>
                }
                <div className="fdk-margin-right-double fdk-auth-link">
                  <a href={`${window.location.origin  }/logout`}>{localization.app.logOut}</a>
                </div>
                <div>
                  <ButtonDropdown className="btn-group-default" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle className="fdk-button fdk-button-default fdk-button-menu dropdown-toggle btn-default" caret>
                      <i className="fa fa-bars fdk-fa-dark fdk-fa-left" />
                      <span>Meny</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Veileder</DropdownItem>
                      <DropdownItem>Standard</DropdownItem>
                      <DropdownItem>
                        <a href="">Felles datakatalog</a>
                      </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fdk-breadcrumb breadcrumb d-flex justify-content-between">
          <span></span>
          <span>{localization.app.autoSave}</span>
        </div>
      </header>
    );
  }
}

Header.defaultProps = {

};

Header.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps({ user }, ownProps) {
  const { userItem } = user || {
    userItem: null
  }

  return {
    userItem
  };
}

export default connect(mapStateToProps)(Header);
