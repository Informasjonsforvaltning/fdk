import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import _sortBy from 'lodash/sortBy';
import cx from 'classnames';

import localization from '../../../lib/localization';
import { getTranslateText } from '../../../lib/translateText';
import './dataset-info.scss';

export class DatasetInfo extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  _renderSpatial() {
    const { spatial } = this.props;
    const header = localization.dataset.spatial;

    const children = items =>
      items.map((item, index) => {
        if (index > 0) {
          return (
            <span
              key={`dataset-info-spatial-${index}`}
              className="fdk-ingress mb-0"
            >
              {`, ${getTranslateText(item.prefLabel)}`}
            </span>
          );
        }
        return (
          <span
            key={`dataset-info-spatial-${index}`}
            className="fdk-ingress mb-0"
          >
            {getTranslateText(item.prefLabel)}
          </span>
        );
      });

    if (spatial && typeof spatial !== 'undefined' && spatial.length > 0) {
      return (
        <div className="col-md-12 p-0">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-map" />
            </div>
            <div className="fdk-detail-text">
              <h5>{header}</h5>
              <p className="fdk-ingress mb-0">{children(spatial)}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  _renderTemporal() {
    const { temporal, language } = this.props;
    const headerFrom = localization.dataset.periodFrom;
    const headerTo = localization.dataset.periodTo;
    const temporalClass = cx('fdk-container-detail', {
      'col-lg-8':
        language && typeof language !== 'undefined' && language.length > 0
    });

    const children = items =>
      items.map((item, index) => {
        if (item.startDate && item.endDate) {
          return (
            <div
              key={`dataset-info-temporal-${index}`}
              className="clearfix mb-1-em"
            >
              <div className="col-12 col-lg-6 dataset-temporal-date">
                <h5>{headerFrom}</h5>
                <p className="fdk-ingress mb-0 text-nowrap">
                  <Moment format="DD.MM.YYYY">{item.startDate}</Moment>
                </p>
              </div>
              <div className="col-12 col-lg-6 dataset-temporal-date">
                <h5>{headerTo}</h5>
                <p className="fdk-ingress mb-0 text-nowrap">
                  <Moment format="DD.MM.YYYY">{item.endDate}</Moment>
                </p>
              </div>
            </div>
          );
        } else if (item.startDate) {
          return (
            <div
              key={`dataset-info-temporal-${index}`}
              className="clearfix mb-1-em"
            >
              <div className="col-12 col-lg-6 dataset-temporal-date">
                <h5>{headerFrom}</h5>
                <p className="fdk-ingress mb-0 text-nowrap">
                  <Moment format="DD.MM.YYYY">{item.startDate}</Moment>
                </p>
              </div>
            </div>
          );
        } else if (item.endDate) {
          return (
            <div key={`dataset-info-temporal-${index}`} className="clearfix">
              <div className="col-12 col-lg-6 offset-lg-6 dataset-temporal-date">
                <h5>{headerTo}</h5>
                <p className="fdk-ingress mb-0 text-nowrap">
                  <Moment format="DD.MM.YYYY">{item.endDate}</Moment>
                </p>
              </div>
            </div>
          );
        }
        return null;
      });

    if (temporal && temporal.length > 0) {
      return (
        <div className={temporalClass}>
          <div className="fdk-detail-icon">
            <i className="fa fa-calendar" />
          </div>
          <div className="fdk-detail-text">{children(temporal)}</div>
        </div>
      );
    }

    return null;
  }

  _renderLanguage() {
    const { language, temporal } = this.props;
    const languageClass = cx('fdk-container-detail col-12', {
      'col-lg-4': temporal && temporal.length > 0
    });
    const children = items =>
      items.map((item, index) => {
        if (item && item.prefLabel) {
          return (
            <p
              key={`dataset-info-language-${index}`}
              className="fdk-ingress mb-0"
            >
              {getTranslateText(item.prefLabel)}
            </p>
          );
        }
        return null;
      });

    if (language && typeof language !== 'undefined' && language.length > 0) {
      return (
        <div className={languageClass}>
          <div className="fdk-detail-icon">
            <i className="fa fa-flag" />
          </div>
          <div className="fdk-detail-text">
            <h5>{localization.dataset.language}</h5>
            {children(language)}
          </div>
        </div>
      );
    }
    return null;
  }

  _renderReferences() {
    const { references } = this.props;

    let referenceTypeCode;
    const children = items =>
      items.map((item, index) => {
        if (item.referenceType.code !== referenceTypeCode) {
          referenceTypeCode = item.referenceType.code;
          return (
            <div
              key={`dataset-reference-${index}`}
              className="fdk-detail-text refer"
            >
              <h5>
                {item.referenceType.prefLabel
                  ? getTranslateText(item.referenceType.prefLabel)
                  : localization.dataset.distribution.referenceDefaultCode}
              </h5>
              <p className="fdk-ingress">
                <a href={item.source.uri}>
                  {item.source.prefLabel
                    ? getTranslateText(item.source.prefLabel)
                    : localization.dataset.distribution.referenceDefault}
                  <i className="fa fa-external-link fdk-fa-right" />
                </a>
              </p>
            </div>
          );
        }
        return (
          <div
            key={`dataset-reference-${index}`}
            className="fdk-detail-text refer"
          >
            <p className="fdk-ingress">
              <a href={item.source.uri}>
                {item.source.prefLabel
                  ? getTranslateText(item.source.prefLabel)
                  : localization.dataset.distribution.referenceDefault}
                <i className="fa fa-external-link fdk-fa-right" />
              </a>
            </p>
          </div>
        );
      });

    if (
      references &&
      typeof references !== 'undefined' &&
      references.length > 0
    ) {
      const groupReferences = _sortBy(references, o => o.referenceType.code); // sort array by referenceType.code
      return (
        <div className="col-12 p-0">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-link" />
            </div>
            {children(groupReferences)}
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    const {
      issued,
      accrualPeriodicity,
      modified,
      provenance,
      hasCurrentnessAnnotation
    } = this.props;

    const isIssued = !!issued;
    const isAccrualPeriodicity = !!accrualPeriodicity;

    const issuedClass = cx('p-0', {
      'col-lg-4': isAccrualPeriodicity,
      'col-lg-12': !isAccrualPeriodicity
    });

    const accrualPeriodicityClass = cx('p-0', {
      'col-lg-8': isIssued,
      'col-lg-12': !isIssued
    });

    return (
      <section>
        <div className="row fdk-row">
          {issued && (
            <div className={issuedClass}>
              <div className="fdk-container-detail">
                <div className="fdk-detail-icon">
                  <i className="fa fa-upload" />
                </div>
                <div className="fdk-detail-text">
                  <h5>{localization.dataset.issued}</h5>
                  <p className="fdk-ingress mb-0 text-nowrap">
                    {issued && <Moment format="DD.MM.YYYY">{issued}</Moment>}
                  </p>
                </div>
              </div>
            </div>
          )}

          {accrualPeriodicity && (
            <div className={accrualPeriodicityClass}>
              <div className="fdk-container-detail">
                <div className="fdk-detail-icon">
                  <i className="fa fa-refresh" />
                </div>
                <div className="fdk-detail-text">
                  <h5>{localization.dataset.frequency}</h5>
                  <p className="fdk-ingress mb-0">
                    {accrualPeriodicity.charAt(0).toUpperCase()}
                    {accrualPeriodicity.substr(1)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {modified && (
            <div className="p-0">
              <div className="fdk-container-detail">
                <div>
                  <h5>{localization.dataset.modified}</h5>
                  <p className="fdk-ingress mb-0">
                    {modified && (
                      <Moment format="DD.MM.YYYY">{modified}</Moment>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {provenance && (
            <div className="p-0">
              <div className="fdk-container-detail">
                <div className="fdk-detail-icon">
                  <i className="fa fa-user" />
                </div>
                <div className="fdk-detail-text">
                  <h5>{localization.dataset.provenance}</h5>
                  <p className="fdk-ingress mb-0">{provenance}</p>
                </div>
              </div>
            </div>
          )}

          {hasCurrentnessAnnotation && (
            <div className="p-0">
              <div className="fdk-container-detail">
                <div className="fdk-detail-icon">
                  <i className="fa fa-certificate" />
                </div>
                <div className="fdk-detail-text">
                  <h5>{localization.dataset.currentness}</h5>
                  <p className="fdk-ingress mb-0">{hasCurrentnessAnnotation}</p>
                </div>
              </div>
            </div>
          )}
          {this._renderSpatial()}
        </div>
        <div className="row fdk-row row-eq-height">
          <div className="col-12 p-0">
            {this._renderTemporal()}
            {this._renderLanguage()}
          </div>
        </div>
        <div className="row fdk-row">{this._renderReferences()}</div>
      </section>
    );
  }
}

DatasetInfo.defaultProps = {
  issued: null,
  accrualPeriodicity: '',
  modified: null,
  provenance: '',
  hasCurrentnessAnnotation: '',
  spatial: null,
  temporal: null,
  language: null,
  references: null
};

DatasetInfo.propTypes = {
  issued: PropTypes.string,
  accrualPeriodicity: PropTypes.string,
  modified: PropTypes.string,
  provenance: PropTypes.string,
  hasCurrentnessAnnotation: PropTypes.string,
  spatial: PropTypes.array,
  temporal: PropTypes.array,
  language: PropTypes.array,
  references: PropTypes.array
};
