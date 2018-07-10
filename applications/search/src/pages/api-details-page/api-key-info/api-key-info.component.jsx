import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../lib/localization';
// import { getTranslateText } from '../../../lib/translateText';

export class ApiKeyInfo extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      colClass: 'col-xs-12'
    };
  }

  componentWillMount() {
    const { type, informationModel, conformsTo } = this.props;
    let countClasses = 0;
    if (type) {
      countClasses += 1;
    }
    if (informationModel && informationModel.length > 0) {
      countClasses += 1;
    }
    if (
      conformsTo &&
      typeof conformsTo !== 'undefined' &&
      conformsTo.length > 0
    ) {
      countClasses += 1;
    }
    if (countClasses > 0) {
      const colWidht = 12 / countClasses;
      const colClass = `col-xs-12 col-sm-${colWidht}`;
      this.setState = {
        colClass
      };
    }
  }

  _renderAccessRights() {
    const { accessRights } = this.props;
    if (accessRights) {
      const { code } = accessRights;
      return (
        <div className="fdk-container-detail fdk-container-detail-header fdk-margin-top-double">
          {/* {code === 'NON_PUBLIC' && ( */}
          {/* <React.Fragment> */}
          {/* <i className="fa fdk-fa-left fdk-color-unntatt fa-lock" /> */}
          {/* API-et er åpent */}
          {/* { */}
          {/* localization.dataset.accessRights.authorityCode */}
          {/* .nonPublicDetailsLabel */}
          {/* } */}
          {/* </React.Fragment> */}
          {/* )} */}
          {/* {code === 'RESTRICTED' && ( */}
          {/* <React.Fragment> */}
          {/* <i className="fa fdk-fa-left fa-unlock-alt fdk-color-begrenset" /> */}
          {/* { */}
          {/* localization.dataset.accessRights.authorityCode */}
          {/* .restrictedDetailsLabel */}
          {/* } */}
          {/* </React.Fragment> */}
          {/* )} */}
          {code === 'PUBLIC' && (
            <React.Fragment>
              <i className="fa fdk-fa-left fa-unlock fdk-color-offentlig" />
              API-et er åpent
            </React.Fragment>
          )}
        </div>
      );
    }
    return null;
  }

  _renderType() {
    const { type } = this.props;
    if (!type) {
      return null;
    }
    const heading = localization.dataset.type;
    return (
      <div>
        {heading}: {type}
      </div>
    );
  }

  _renderFormat() {
    const { format } = this.props;
    if (!format) {
      return null;
    }
    const heading = localization.dataset.distribution.format;
    return (
      <div>
        {heading}: {format}
      </div>
    );
  }

  render() {
    return (
      <section>
        {this._renderType()}
        {this._renderFormat()}
        {this._renderAccessRights()}
      </section>
    );
  }
}

ApiKeyInfo.defaultProps = {
  accessRights: null,
  type: '',
  format: ''
};

ApiKeyInfo.propTypes = {
  accessRights: PropTypes.object,
  type: PropTypes.string,
  format: PropTypes.string
};
