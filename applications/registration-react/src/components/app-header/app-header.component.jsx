import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetchUserIfNeeded } from '../../actions/index';
import localization from '../../lib/localization';
import '../../assets/style/bootstrap-override.scss';
import '../../assets/style/react-tags-override.scss';
import './styles';
import './app-header.scss';

export class HeaderPure extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
    dispatch(fetchUserIfNeeded());
  }

  toggle() {
    const { dropdownOpen } = this.state;
    this.setState({ dropdownOpen: !dropdownOpen });
  }

  render() {
    let headerTitle;
    const { location, userItem } = this.props;
    switch (location.pathname.split('/')[3]) {
      case 'datasets':
        headerTitle = localization.header['Registration of Datasets'];
        break;
      case 'apis':
        headerTitle = localization.header["Registration of API's"];
        break;
      default:
        headerTitle = localization.app.title;
    }
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
                    src="/static/img/logo-registrering.svg"
                    alt="Logo for Felles datakatalog"
                  />
                </a>
              </div>

              <div className="col-6 col-md-4 d-flex justify-content-center align-items-center">
                <span>
                  <strong>{headerTitle}</strong>
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
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

HeaderPure.defaultProps = {
  userItem: null
};

HeaderPure.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userItem: PropTypes.object,
  location: PropTypes.object.isRequired
};

function mapStateToProps(props) {
  const { user } = props;
  const { userItem } = user || {
    userItem: null
  };

  return {
    userItem
  };
}

export const Header = withRouter(connect(mapStateToProps)(HeaderPure));
