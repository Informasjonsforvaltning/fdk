import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

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
    let isApiReg;
    let isDatasetReg;
    if (this.props.location) {
      isApiReg = this.props.location.pathname.split('/')[3] === 'apis';
      isDatasetReg = this.props.location.pathname.split('/')[3] === 'datasets';
    }
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
                    src="/static/img/logo-registrering.svg"
                    alt="Logo for Felles datakatalog"
                  />
                </a>
              </div>

              <div className="col-6 col-md-4 d-flex justify-content-center align-items-center">
                <span>
                  <strong>
                    {isApiReg && localization.header["Registration of API's"]}
                    {isDatasetReg &&
                      localization.header['Registration of Datasets']}
                    {!isDatasetReg && !isApiReg && localization.app.title}
                  </strong>
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

Header.defaultProps = {
  userItem: null
};

Header.propTypes = {
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

export default withRouter(connect(mapStateToProps)(Header));
