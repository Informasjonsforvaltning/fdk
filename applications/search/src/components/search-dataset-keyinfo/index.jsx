import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../components/localization';

export default class DatasetKeyInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const language = this.props.selectedLanguageCode;
    const description =
      this.props.description[language] || this.props.description.nb || this.props.description.nn || this.props.description.en;

    let distribution_non_public = false;
    let distribution_restricted = false;
    let distribution_public = false;

    if (this.props.accessRights && this.props.authorityCode === 'NON_PUBLIC') {
      distribution_non_public = true;
    } else if (this.props.accessRights && this.props.authorityCode === 'RESTRICTED') {
      distribution_restricted = true;
    } else if (this.props.accessRights && this.props.authorityCode === 'PUBLIC') {
      distribution_public = true;
    } else if (!this.props.accessRights) { // antar public hvis authoritycode mangler
      distribution_public = true;
    }

    const distributionClass = cx(
      'fdk-container-detail',
      {
        'fdk-container-detail-offentlig': distribution_public,
        'fdk-container-detail-begrenset': distribution_restricted,
        'fdk-container-detail-unntatt-offentlig': distribution_non_public
      }
    )

    return (
      <div>
        <div className="fdk-container-detail fdk-container-detail-header fdk-margin-top-double">
          <i className="fa fa-unlock fdk-fa-left fdk-color-green" />Datasettet er offentlig
        </div>
      </div>
    );
  }
}

DatasetKeyInfo.defaultProps = {
  title: null,
  description: null,
  accessURL: null,
  format: null,
  authorityCode: 'PUBLIC',
  selectedLanguageCode: null
};

DatasetKeyInfo.propTypes = {
  title: PropTypes.object,
  description: PropTypes.object,
  accessUrl: PropTypes.string,
  format: PropTypes.string,
  authorityCode: PropTypes.string,
  selectedLanguageCode: PropTypes.string
};
