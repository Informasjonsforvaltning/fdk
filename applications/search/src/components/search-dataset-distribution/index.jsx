import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../components/localization';
import DistributionFormat from '../search-dataset-format';

export default class DatasetDistribution extends React.Component { // eslint-disable-line react/prefer-stateless-function
  _renderFormats(authorityCode) {
    if (this.props.format) {
      const formatArray = this.props.format.trim().split(',');
      const formatNodes = Object.keys(formatArray).map((key) => {
        if (formatArray[key] !== null) {
          return (
            <DistributionFormat
              authorityCode={authorityCode}
              key={key}
              text={formatArray[key]}
            />
          );
        }
        return null;
      });
      return formatNodes;
    }
    return null;
  }

  _renderTilgangsURL() {
    if (this.props.accessUrl) {
      return (
        <div id="dataset-distribution-accessurl">
          <h5 className="fdk-margin-top-double">{localization.dataset.distribution.accessUrl}</h5>
          <p className="fdk-ingress">
            <a
              href={this.props.accessUrl}
            >
              {this.props.accessUrl}
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
          </p>
        </div>
      );
    }
    return null;
  }

  render() {
    let distributionNonPublic = false;
    let distributionRestricted = false;
    let distributionPublic = false;

    /*
    if (this.props.authorityCode === 'NON_PUBLIC') {
      distributionNonPublic = true;
    } else if (this.props.authorityCode === 'RESTRICTED') {
      distributionRestricted = true;
    } else if (this.props.authorityCode === 'PUBLIC') {
      distributionPublic = true;
    } else { // antar public hvis authoritycode mangler
      distributionPublic = true;
    }
    */


    let authorityCode = '';
    if (this.props.authorityCode) {
      authorityCode = this.props.authorityCode;
    }

    if (authorityCode === 'NON_PUBLIC') {
      distributionNonPublic = true;
    } else if (authorityCode === 'RESTRICTED') {
      distributionRestricted = true;
    } else if (authorityCode === 'PUBLIC') {
      distributionPublic = true;
    } else { // antar public hvis authoritycode mangler
      distributionPublic = true;
    }

    const distributionClass = cx(
      'fdk-container-detail',
      {
        'fdk-container-detail-offentlig': distributionPublic,
        'fdk-container-detail-begrenset': distributionRestricted,
        'fdk-container-detail-unntatt-offentlig': distributionNonPublic
      }
    );

    return (
      <div>
        <div id="dataset-distribution" className={distributionClass}>
          <h4 className="fdk-margin-bottom">{localization.dataset.distribution.title}</h4>
          {this.props.description &&
          <p id="dataset-distribution-description" className="fdk-ingress">
            {this.props.description}
          </p>
          }
          {this.props.format &&
          <h5 className="fdk-space-above">
            {localization.dataset.distribution.format}
          </h5>
          }
          {this._renderFormats(authorityCode)}
          {this._renderTilgangsURL()}
          <div className="fdk-container-detail-text">
            <h5 className="fdk-margin-top-double">{localization.dataset.distribution.created}</h5>
            <p className="fdk-ingress fdk-ingress-detail">TODO: Dette er innholdet i denne boksen.</p>
          </div>
        </div>
      </div>
    );
  }
}

DatasetDistribution.defaultProps = {
  description: null,
  accessUrl: null,
  format: null,
  authorityCode: 'PUBLIC',
  selectedLanguageCode: null
};

DatasetDistribution.propTypes = {
  description: PropTypes.string,
  accessUrl: PropTypes.string,
  format: PropTypes.string,
  authorityCode: PropTypes.string,
  selectedLanguageCode: PropTypes.string
};
