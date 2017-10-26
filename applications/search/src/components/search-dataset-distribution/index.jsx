import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../components/localization';
import DistributionFormat from '../search-dataset-format';
import './index.scss';

export default class DatasetDistribution extends React.Component { // eslint-disable-line react/prefer-stateless-function
  _renderFormats() {
    const { code, format } = this.props;
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
    if (license && license.uri) {
      return (
        <div>
          <h5 className="fdk-margin-top-double">{localization.dataset.distribution.license}</h5>
          <p className="fdk-ingress">
            {license && license.uri && license.prefLabel &&
            <a
              href={license.uri}
            >
              {
                license.prefLabel[this.props.selectedLanguageCode]
                || license.prefLabel.nb
                || license.prefLabel.nn
                || license.prefLabel.en
              }
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
            }
            {license && license.uri && !license.prefLabel &&
            <a
              href={license.uri}
            >
              {localization.dataset.distribution.standard}
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
            }
          </p>
        </div>
      );
    }
    return null;
  }

  _renderConformsTo() {
    const { conformsTo } = this.props;

    const children = items => items.map((item, index) => (
      <a
        key={item.uri}
        href={item.uri}
      >
        {
          item.prefLabel[this.props.selectedLanguageCode]
          || item.prefLabel.nb
          || item.prefLabel.nn
          || item.prefLabel.en
        }
        <i className="fa fa-external-link fdk-fa-right" />
      </a>
    ));

    if (conformsTo) {
      return (
        <div>
          <h5 className="fdk-margin-top-double">{localization.dataset.distribution.conformsTo}</h5>
          <p className="fdk-ingress">
            { children(conformsTo) }
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
            key={page.uri}
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

    if (page) {
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
    const { title, code } = this.props;
    const distributionClass = cx(
      'fdk-container-detail',
      {
        'fdk-container-detail-unntatt-offentlig': code === 'NON_PUBLIC',
        'fdk-container-detail-begrenset': code === 'RESTRICTED',
        'fdk-container-detail-offentlig': code === 'PUBLIC',
        'fdk-container-detail-sample': code === 'SAMPLE'
      }
    );
    return (
      <div id="dataset-distribution" className={distributionClass}>
        <h4 className="fdk-margin-bottom">{title}</h4>
        {this.props.description &&
          <p id="dataset-distribution-description" className="fdk-ingress">
            {this.props.description}
          </p>
        }
        { this._renderFormats() }
        { this._renderTilgangsURL() }
        { this._renderLicense() }
        { this._renderConformsTo() }
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
  title: '',
  description: null,
  accessUrl: null,
  format: null,
  code: '',
  license: null,
  conformsTo: null,
  page: null,
  selectedLanguageCode: null
};

DatasetDistribution.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  accessUrl: PropTypes.array,
  format: PropTypes.array,
  code: PropTypes.string,
  license: PropTypes.object,
  conformsTo: PropTypes.array,
  page: PropTypes.array,
  selectedLanguageCode: PropTypes.string
};
