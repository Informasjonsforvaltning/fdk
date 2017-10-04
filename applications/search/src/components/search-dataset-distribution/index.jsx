import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../components/localization';
import DistributionFormat from '../search-dataset-format';

export default class DatasetDistribution extends React.Component { // eslint-disable-line react/prefer-stateless-function

  _renderFormats(format) {
    const formatArray = format.trim().split(',');
    const formatNodes = Object.keys(formatArray).map((key) => {
      if (formatArray[key] !== null) {
        return (
          <DistributionFormat
            key={key}
            text={formatArray[key]}
          />
        );
      }
    });
    return formatNodes;
  }

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
        <div className={distributionClass}>
          <h4 className="fdk-margin-bottom">{localization.detail.distribution.title}</h4>
          <p className="fdk-ingress">
            {description}
          </p>

          {this.props.format &&
          <h5 className="fdk-space-above">{localization.detail.distribution.format}</h5>
          }

          {this._renderFormats(this.props.format)}


          <h5 className="fdk-margin-top-double">{localization.detail.distribution.accessUrl}</h5>
          <p className="fdk-ingress">
            <a
              href={this.props.accessURL}
            >
              {this.props.accessUrl}
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
          </p>


          <div className="fdk-container-detail-text">
            <h5 className="fdk-margin-top-double">{localization.detail.distribution.created}</h5>
            <p className="fdk-ingress fdk-ingress-detail">Dette er innholdet i denne boksen.</p>
          </div>
        </div>
      </div>
    );
  }
}

DatasetDistribution.defaultProps = {
  title: null,
  description: null,
  accessURL: null,
  format: null,
  authorityCode: 'PUBLIC',
  selectedLanguageCode: null
};

DatasetDistribution.propTypes = {
  title: PropTypes.object,
  description: PropTypes.object,
  accessUrl: PropTypes.string,
  format: PropTypes.string,
  authorityCode: PropTypes.string,
  selectedLanguageCode: PropTypes.string
};
