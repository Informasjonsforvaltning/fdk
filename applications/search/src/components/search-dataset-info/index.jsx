import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import _sortBy from 'lodash/sortBy';
import cx from 'classnames';

import localization from '../../components/localization';
import { getTranslateText } from '../../utils/translateText';
import './index.scss';

export default class DatasetInfo extends React.Component {
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
              className="fdk-ingress fdk-margin-bottom-no"
            >
              {`, ${item.prefLabel[this.props.selectedLanguageCode] ||
                item.prefLabel.nb ||
                item.prefLabel.nn ||
                item.prefLabel.en}`}
            </span>
          );
        }
        return (
          <span
            key={`dataset-info-spatial-${index}`}
            className="fdk-ingress fdk-margin-bottom-no"
          >
            {`${item.prefLabel[this.props.selectedLanguageCode] ||
              item.prefLabel.nb ||
              item.prefLabel.nn ||
              item.prefLabel.en}`}
          </span>
        );
      });

    if (spatial && typeof spatial !== 'undefined' && spatial.length > 0) {
      return (
        <div className="col-md-12 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-map" />
            </div>
            <div className="fdk-detail-text">
              <h5>{header}</h5>
              <p
                id="dataset-info-spatial"
                className="fdk-ingress fdk-margin-bottom-no"
              >
                {children(spatial)}
              </p>
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
      'col-md-8':
        language && typeof language !== 'undefined' && language.length > 0,
      'col-md-12': !(
        language &&
        typeof language !== 'undefined' &&
        language.length > 0
      )
    });

    const children = items =>
      items.map((item, index) => {
        if (item.startDate && item.endDate) {
          return (
            <div
              key={`dataset-info-temporal-${index}`}
              id={`dataset-info-temporal-${index}`}
              className="clearfix mb-1"
            >
              <div className="col-md-6 dataset-temporal-date">
                <h5>{headerFrom}</h5>
                <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                  <Moment format="DD.MM.YYYY">{item.startDate}</Moment>
                </p>
              </div>
              <div className="col-md-6 dataset-temporal-date">
                <h5>{headerTo}</h5>
                <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                  <Moment format="DD.MM.YYYY">{item.endDate}</Moment>
                </p>
              </div>
            </div>
          );
        } else if (item.startDate) {
          return (
            <div
              key={`dataset-info-temporal-${index}`}
              id={`dataset-info-temporal-${index}`}
              className="clearfix mb-1"
            >
              <div className="col-md-6 dataset-temporal-date">
                <h5>{headerFrom}</h5>
                <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                  <Moment format="DD.MM.YYYY">{item.startDate}</Moment>
                </p>
              </div>
            </div>
          );
        } else if (item.endDate) {
          return (
            <div
              key={`dataset-info-temporal-${index}`}
              id={`dataset-info-temporal-${index}`}
              className="clearfix"
            >
              <div className="col-md-6 col-md-offset-6 dataset-temporal-date">
                <h5>{headerTo}</h5>
                <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
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
          <div id="dataset-info-temporal" className="fdk-detail-text">
            {children(temporal)}
          </div>
        </div>
      );
    }

    return null;
  }

  _renderLanguage() {
    const { language, temporal, selectedLanguageCode } = this.props;
    const languageClass = cx('fdk-container-detail', {
      'col-md-4': temporal && temporal.length > 0,
      'col-md-12': !(temporal && temporal.length > 0)
    });
    const children = items =>
      items.map((item, index) => {
        if (item && item.prefLabel) {
          return (
            <p
              key={`dataset-info-language-${index}`}
              id={`dataset-info-language-${index}`}
              className="fdk-ingress fdk-margin-bottom-no"
            >
              {getTranslateText(item.prefLabel, selectedLanguageCode)}
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
          <div id="dataset-info-language" className="fdk-detail-text">
            <h5>{localization.dataset.language}</h5>
            {children(language)}
          </div>
        </div>
      );
    }
    return null;
  }

  _renderReferences() {
    const { references, selectedLanguageCode } = this.props;

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
                  ? getTranslateText(
                      item.referenceType.prefLabel,
                      selectedLanguageCode
                    )
                  : localization.dataset.distribution.referenceDefaultCode}
              </h5>
              <p className="fdk-ingress">
                <a href={item.source.uri}>
                  {item.source.prefLabel
                    ? getTranslateText(
                        item.source.prefLabel,
                        selectedLanguageCode
                      )
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
                  ? getTranslateText(
                      item.source.prefLabel,
                      selectedLanguageCode
                    )
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
      let groupReferences = references;
      groupReferences = _sortBy(references, o => o.referenceType.code); // sort array by referenceType.code
      return (
        <div className="col-md-12 fdk-padding-no">
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

    const issuedClass = cx('fdk-padding-no', {
      'col-md-4': isAccrualPeriodicity,
      'col-md-12': !isAccrualPeriodicity
    });

    const accrualPeriodicityClass = cx('fdk-padding-no', {
      'col-md-8': isIssued,
      'col-md-12': !isIssued
    });

    return (
      <section id="dataset-info">
        <div className="row fdk-row">
          {issued && (
            <div className={issuedClass}>
              <div className="fdk-container-detail">
                <div className="fdk-detail-icon">
                  <i className="fa fa-upload" />
                </div>
                <div className="fdk-detail-text">
                  <h5>{localization.dataset.issued}</h5>
                  <p
                    id="dataset-info-issued"
                    className="fdk-ingress fdk-margin-bottom-no text-nowrap"
                  >
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
                  <p
                    id="dataset-info-accrualPeriodicity"
                    className="fdk-ingress fdk-margin-bottom-no"
                  >
                    {accrualPeriodicity.charAt(0).toUpperCase()}
                    {accrualPeriodicity.substr(1)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {modified && (
            <div className="col-xs-12 fdk-padding-no">
              <div className="fdk-container-detail">
                <div>
                  <h5>{localization.dataset.modified}</h5>
                  <p
                    id="dataset-info-accrualPeriodicity"
                    className="fdk-ingress fdk-margin-bottom-no"
                  >
                    {modified && (
                      <Moment format="DD.MM.YYYY">{modified}</Moment>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {provenance && (
            <div className="col-md-12 fdk-padding-no">
              <div className="fdk-container-detail">
                <div className="fdk-detail-icon">
                  <i className="fa fa-user" />
                </div>
                <div className="fdk-detail-text">
                  <h5>{localization.dataset.provenance}</h5>
                  <p
                    id="dataset-info-provenance"
                    className="fdk-ingress fdk-margin-bottom-no"
                  >
                    {provenance}
                  </p>
                </div>
              </div>
            </div>
          )}

          {hasCurrentnessAnnotation && (
            <div className="col-md-12 fdk-padding-no">
              <div className="fdk-container-detail">
                <div className="fdk-detail-icon">
                  <i className="fa fa-certificate" />
                </div>
                <div className="fdk-detail-text">
                  <h5>{localization.dataset.currentness}</h5>
                  <p
                    id="dataset-info-currentnessAnnotation"
                    className="fdk-ingress fdk-margin-bottom-no"
                  >
                    {hasCurrentnessAnnotation}
                  </p>
                </div>
              </div>
            </div>
          )}
          {this._renderSpatial()}
        </div>
        <div className="row fdk-row row-eq-height">
          {this._renderTemporal()}
          {this._renderLanguage()}
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
  references: null,
  selectedLanguageCode: ''
};

DatasetInfo.propTypes = {
  issued: PropTypes.number,
  accrualPeriodicity: PropTypes.string,
  modified: PropTypes.string,
  provenance: PropTypes.string,
  hasCurrentnessAnnotation: PropTypes.string,
  spatial: PropTypes.array,
  temporal: PropTypes.array,
  language: PropTypes.array,
  references: PropTypes.array,
  selectedLanguageCode: PropTypes.string
};
