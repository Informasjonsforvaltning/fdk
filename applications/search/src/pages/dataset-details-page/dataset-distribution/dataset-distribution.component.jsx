import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../../lib/localization';
import { getDistributionTypeByUri } from '../../../redux/modules/distributionType';
import { getTranslateText } from '../../../lib/translateText';
import { DistributionFormat } from '../../../components/distribution-format/distribution-format.component';
import './dataset-distribution.scss';

export class DatasetDistribution extends React.Component {
  // eslint-disable-line react/prefer-stateless-function

  _renderType() {
    const { distributionTypeItems } = this.props;
    let { type } = this.props;
    if (type) {
      if (type !== 'API' && type !== 'Feed' && type !== 'Nedlastbar fil') {
        const distributionType = getDistributionTypeByUri(
          distributionTypeItems,
          type
        );
        if (distributionType !== null && distributionType.length > 0) {
          type = getTranslateText(distributionType[0].prefLabel);
        } else {
          type = null;
        }
      }
      return (
        <div>
          <h5 className="mt-5">{localization.dataset.distribution.type}</h5>
          <p className="fdk-ingress">{type}</p>
        </div>
      );
    }
    return null;
  }

  _renderFormats() {
    const { code, format } = this.props;
    const children = (items, code) =>
      items.map(item => {
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
          <h5 className="mt-4">{localization.dataset.distribution.format}</h5>
          {children(format, code)}
        </div>
      );
    }
    return null;
  }

  _renderTilgangsURL() {
    const { accessUrl } = this.props;
    const children = items =>
      items.map((item, index) => (
        <a
          key={`dataset-distribution-accessurl-${index}`}
          className="dataset-distribution-accessurl"
          href={item}
        >
          {item}
          <i className="fa fa-external-link fdk-fa-right" />
        </a>
      ));

    if (accessUrl) {
      return (
        <div>
          <h5 className="mt-5">
            {localization.dataset.distribution.accessUrl}
          </h5>
          <p className="fdk-ingress">{children(accessUrl)}</p>
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
          <h5 className="mt-5">{localization.dataset.distribution.license}</h5>
          <p className="fdk-ingress">
            {license &&
              license.uri &&
              license.prefLabel && (
                <a href={license.uri}>
                  {getTranslateText(license.prefLabel)}
                  <i className="fa fa-external-link fdk-fa-right" />
                </a>
              )}
            {license &&
              license.uri &&
              !license.prefLabel && (
                <a href={license.uri}>
                  {localization.dataset.distribution.licenseLinkDefault}
                  <i className="fa fa-external-link fdk-fa-right" />
                </a>
              )}
          </p>
        </div>
      );
    }
    return null;
  }

  _renderConformsTo() {
    const { conformsTo } = this.props;

    const children = items =>
      items.map(item => (
        <a key={item.uri} href={item.uri}>
          {item.prefLabel
            ? getTranslateText(item.prefLabel)
            : localization.dataset.distribution.standard}
          <i className="fa fa-external-link fdk-fa-right" />
        </a>
      ));

    if (conformsTo) {
      return (
        <div>
          <h5 className="mt-5">
            {localization.dataset.distribution.conformsTo}
          </h5>
          <p className="fdk-ingress">{children(conformsTo)}</p>
        </div>
      );
    }
    return null;
  }

  _renderDistributionPage() {
    const { page } = this.props;
    const children = items =>
      items.map(page => {
        if (page && page.uri) {
          return (
            <a key={page.uri} href={page.uri}>
              {page.prefLabel ? getTranslateText(page.prefLabel) : page.uri}
            </a>
          );
        }
        return null;
      });

    if (page) {
      return (
        <div>
          <h5 className="mt-5">{localization.dataset.distribution.page}</h5>
          <p className="fdk-ingress">{children(page)}</p>
        </div>
      );
    }
    return null;
  }

  render() {
    const { title, code } = this.props;
    const distributionClass = cx('fdk-container-detail', {
      'fdk-container-detail-unntatt-offentlig': code === 'NON_PUBLIC',
      'fdk-container-detail-begrenset': code === 'RESTRICTED',
      'fdk-container-detail-offentlig': code === 'PUBLIC',
      'fdk-container-detail-sample': code === 'SAMPLE'
    });
    return (
      <section className={distributionClass}>
        <h4>{title}</h4>
        {this.props.description && (
          <p className="fdk-ingress">{this.props.description}</p>
        )}
        {this._renderType()}
        {this._renderFormats()}
        {this._renderTilgangsURL()}
        {this._renderLicense()}
        {this._renderConformsTo()}
        {this._renderDistributionPage()}
      </section>
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
  type: null,
  distributionTypeItems: null
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
  type: PropTypes.string,
  distributionTypeItems: PropTypes.array
};
