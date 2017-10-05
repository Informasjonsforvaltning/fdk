import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../components/localization';

export default class DatasetKeyInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const language = this.props.selectedLanguageCode;

    let distribution_non_public = false;
    let distribution_restricted = false;
    let distribution_public = false;
    console.log('this.props.accessRights is ', this.props.accessRights);
    if (this.props.accessRights && this.props.authorityCode === 'NON_PUBLIC') {
      distribution_non_public = true;
    } else if (this.props.accessRights && this.props.authorityCode === 'RESTRICTED') {
      distribution_restricted = true;
    } else if (this.props.accessRights && this.props.authorityCode === 'PUBLIC') {
      distribution_public = true;
    } else if (!this.props.accessRights) { // antar public hvis authoritycode mangler
      distribution_public = true;
    }

    const accessRightClass = cx(
      'fa fdk-fa-left',
      {
        'fdk-color-green fa-unlock': distribution_public,
        'fa-lock fdk-color-orange': distribution_restricted,
        'fa-lock fdk-color-red': distribution_non_public
      }
    )

    return (
      <div>
        <div className="fdk-container-detail fdk-container-detail-header fdk-margin-top-double">
          <i className={accessRightClass} />
            Datasettet er {distribution_public ? 'offentlig':''}
             {distribution_restricted ? 'begrenset':''}
             {distribution_non_public ? 'ikke offentlig':''}
        </div>
      </div>
    );
  }
}

DatasetKeyInfo.defaultProps = {
  authorityCode: 'PUBLIC',
  selectedLanguageCode: null
};

DatasetKeyInfo.propTypes = {
  authorityCode: PropTypes.string,
  selectedLanguageCode: PropTypes.string
};
