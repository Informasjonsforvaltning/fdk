import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../components/localization';
import DistributionFormat from '../search-dataset-format';
import './index.scss';

export default class DatasetDistribution extends React.Component { // eslint-disable-line react/prefer-stateless-function
  _renderFormats(code) {
    const { format } = this.props;

    const children = (items, code) => items.map((item) => {
      if (item !== null) {
        const formatArray = item.trim().split(',');
        return formatArray.map((item, index) => {
          if (item === null) {
            return null;
          }
          return (
            <DistributionFormat
              key={`dataset-distribution-format${index}`}
              code={code}
              text={item}
            />
          );
        });
      }
      return null;
    });

    if (format && format[0] !== null) {
      return (
        <div>
          <h5 className="fdk-space-above">
            {localization.dataset.distribution.format}
          </h5>
          { children(format, code) }
        </div>
      );
    }
    return null;
  }


  _renderTilgangsURL() {
    const { accessUrl } = this.props;
    const children = items => items.map((item, index) => (
      <a
        key={`dataset-distribution-accessurl-${index}`}
        id={`dataset-distribution-accessurl-${index}`}
        href={item}
      >
        {item}
        <i className="fa fa-external-link fdk-fa-right" />
      </a>
    ));

    if (accessUrl) {
      return (
        <div>
          <h5 className="fdk-margin-top-double">{localization.dataset.distribution.accessUrl}</h5>
          <p className="fdk-ingress">
            { children(accessUrl) }
          </p>
        </div>
      );
    }
    return null;
  }

  _renderLicense() {
    const { license } = this.props;

    const children = items => items.map((license) => {
      if (license && license.uri && license.prefLabel) {
        return (
          <a
            href={license.uri}
          >
            {
              license.prefLabel[this.props.selectedLanguageCode]
              || license.prefLabel.nb
              || license.prefLabel.nn
              || license.prefLabel.en
            }
          </a>
        );
      } else if (license && license.uri) {
        return (
          <a
            href={license.uri}
          >
            {localization.dataset.distribution.standard}
          </a>
        );
      }
      return null;
    });

    if (license && license.uri) {
      return (
        <div>
          <h5 className="fdk-margin-top-double">{localization.dataset.distribution.license}</h5>
          <p className="fdk-ingress">
            { children(license) }
          </p>
        </div>
      );
    }
    return null;
  }

  _renderDistributionPage() {
    const { page } = this.props;
    const children = items => items.map((page) => {
      if (page && page.uri && page.prefLabel) {
        return (
          <a
            href={page.uri}
          >
            {
              page.prefLabel[this.props.selectedLanguageCode]
              || page.prefLabel.nb
              || page.prefLabel.nn
              || page.prefLabel.en
            }
          </a>
        );
      }
      return null;
    });

    if (page && page.uri) {
      return (
        <div>
          <h5 className="fdk-margin-top-double">{localization.dataset.distribution.page}</h5>
          <p className="fdk-ingress">
            { children(page) }
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

    let code = '';
    if (this.props.code) {
      code = this.props.code;
    }

    if (code === 'NON_PUBLIC') {
      distributionNonPublic = true;
    } else if (code === 'RESTRICTED') {
      distributionRestricted = true;
    } else if (code === 'PUBLIC') {
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
      <div id="dataset-distribution" className={distributionClass}>

        <h4 className="fdk-margin-bottom">{localization.dataset.distribution.title}</h4>

        {this.props.description &&
          <p id="dataset-distribution-description" className="fdk-ingress">
            {this.props.description}
          </p>
        }

        { this._renderFormats(code) }
        { this._renderTilgangsURL() }
        { this._renderLicense() }
        { this._renderDistributionPage() }

        <div className="fdk-container-detail-text">
          <h5 className="fdk-margin-top-double">{localization.dataset.distribution.created}</h5>
          <p className="fdk-ingress fdk-ingress-detail" />
        </div>
      </div>

    );
  }
}

DatasetDistribution.defaultProps = {
  description: null,
  accessUrl: null,
  format: null,
  code: 'PUBLIC',
  selectedLanguageCode: null
};

DatasetDistribution.propTypes = {
  description: PropTypes.string,
  accessUrl: PropTypes.array,
  format: PropTypes.array,
  code: PropTypes.string,
  license: PropTypes.object,
  page: PropTypes.object,
  selectedLanguageCode: PropTypes.string
};
