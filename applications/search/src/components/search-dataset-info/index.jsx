import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import _sortBy from 'lodash/sortBy';
import cx from 'classnames';

import localization from '../../components/localization';
import './index.scss';

const noTextToShow = '—';

export default class DatasetInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  _renderSpatial() {
    const { spatial } = this.props;
    const header = localization.dataset.spatial;

    const children = items => items.map((item, index) => {
      if (index > 0) {
        return (
          <span
            key={`dataset-info-spatial-${index}`}
            className="fdk-ingress fdk-margin-bottom-no"
          >
            {`, ${item.prefLabel[this.props.selectedLanguageCode] || item.prefLabel.nb || item.prefLabel.nn || item.prefLabel.en}`}
          </span>
        );
      }
      return (
        <span
          key={`dataset-info-spatial-${index}`}
          className="fdk-ingress fdk-margin-bottom-no"
        >
          {`${item.prefLabel[this.props.selectedLanguageCode] || item.prefLabel.nb || item.prefLabel.nn || item.prefLabel.en}`}
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
              <h5>{ header }</h5>
              <p id="dataset-info-spatial" className="fdk-ingress fdk-margin-bottom-no">
                { children(spatial) }
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  _renderTemporal() {
    const { temporal } = this.props;
    const headerFrom = localization.dataset.periodFrom;
    const headerTo = localization.dataset.periodTo;

    const children = items => items.map((item, index) => {
      if (item.startDate && item.endDate) {
        return (
          <div
            key={`dataset-info-temporal-${index}`}
            id={`dataset-info-temporal-${index}`}
          >
            <div className="dataset-temporal-date">
              <h5>{ headerFrom }</h5>
              <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                <Moment format="DD.MM.YYYY">
                  {item.startDate}
                </Moment>
              </p>
            </div>
            <div className="dataset-temporal-date pull-right">
              <h5>{ headerTo }</h5>
              <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                <Moment format="DD.MM.YYYY">
                  {item.endDate}
                </Moment>
              </p>
            </div>
          </div>
        );
      } else if (item.startDate) {
        return (
          <div
            key={`dataset-info-temporal-${index}`}
            id={`dataset-info-temporal-${index}`}
          >
            <div className="dataset-temporal-date">
              <h5>{ headerFrom }</h5>
              <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                <Moment format="DD.MM.YYYY">
                  {item.startDate}
                </Moment>
              </p>
            </div>
          </div>
        );
      } else if (item.endDate) {
        return (
          <div
            key={`dataset-info-temporal-${index}`}
            id={`dataset-info-temporal-${index}`}
          >
            <div className="dataset-temporal-date">
              <h5>{ headerTo }</h5>
              <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                <Moment format="DD.MM.YYYY">
                  {item.endDate}
                </Moment>
              </p>
            </div>
          </div>
        );
      } return null;
    });

    if (temporal && temporal.length > 0) {
      return (
        <div className="col-md-8 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-calendar" />
            </div>
            <div id="dataset-info-temporal" className="fdk-detail-text">
              { children(temporal) }
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  _renderLanguage() {
    const { language, temporal } = this.props;
    const isTemporal = (temporal && temporal.length > 0) || false;
    const languageClass = cx(
      'fdk-padding-no',
      {
        'col-md-4': isTemporal,
        'col-md-12': !isTemporal
      }
    );
    const children = items => items.map((item, index) => {
      if (item && item.prefLabel) {
        return (
          <p
            key={`dataset-info-language-${index}`}
            id={`dataset-info-language-${index}`}
            className="fdk-ingress fdk-margin-bottom-no"
          >
            {item.prefLabel[this.props.selectedLanguageCode] || item.prefLabel.nb || item.prefLabel.nn || item.prefLabel.en}
          </p>
        );
      }
      return null;
    });

    if (language && typeof language !== 'undefined' && language.length > 0) {
      return (
        <div className={languageClass}>
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-flag" />
            </div>
            <div id="dataset-info-language" className="fdk-detail-text">
              <h5>{localization.dataset.language}</h5>
              { children(language) }
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  _renderReferences() {
    let referencesNodes;
    const { references } = this.props;
    if (references && typeof references !== 'undefined' && references.length > 0) {
      let groupReferences = references;
      groupReferences = _sortBy(references, o => o.referenceType.code); // sort array by referenceType.code

      let referenceTypeCode = '';
      referencesNodes = groupReferences.map((item, index) => {
        if (item.referenceType.code !== referenceTypeCode) {
          referenceTypeCode = item.referenceType.code;
          return (
            <div key={`dataset-${index}`} className="col-md-12 fdk-padding-no">
              <div className="fdk-container-detail">
                <div className="fdk-detail-icon">
                  <i className="fa fa-link" />
                </div>
                <div className="fdk-detail-text refer">
                  <h5>
                    {
                      item.referenceType.prefLabel[this.props.selectedLanguageCode]
                      || item.referenceType.prefLabel.nb
                      || item.referenceType.prefLabel.nn
                      || item.referenceType.prefLabel.en
                    }
                  </h5>
                  <p className="fdk-ingress">
                    <a
                      href={item.source.uri}
                    >
                      {
                        item.source.title[this.props.selectedLanguageCode]
                        || item.source.title.nb
                        || item.source.title.nn
                        || item.source.title.en
                      }
                      <i className="fa fa-external-link fdk-fa-right" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div key={`dataset-${index}`} className="col-md-12 fdk-padding-no">
            <div className="fdk-container-detail">
              <div className="fdk-detail-icon">
                <i className="fa fa-link" />
              </div>
              <div className="fdk-detail-text refer">
                <h5>
                  {
                    item.referenceType.prefLabel[this.props.selectedLanguageCode]
                    || item.referenceType.prefLabel.nb
                    || item.referenceType.prefLabel.nn
                    || item.referenceType.prefLabel.en
                  }
                </h5>
                <p className="fdk-ingress">
                  <a
                    href={item.source.uri}
                  >
                    {
                      item.source.title[this.props.selectedLanguageCode]
                      || item.source.title.nb
                      || item.source.title.nn
                      || item.source.title.en
                    }
                    <i className="fa fa-external-link fdk-fa-right" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        );
      });
      return referencesNodes;
    }
    return null;
  }

  render() {
    const {
      issued,
      accrualPeriodicity,
      provenance,
      hasCurrentnessAnnotation
    } = this.props;

    const isIssued = !!issued;
    const isAccrualPeriodicity = !!accrualPeriodicity;

    const issuedClass = cx(
      'fdk-padding-no',
      {
        'col-md-4': isAccrualPeriodicity,
        'col-md-12': !isAccrualPeriodicity
      }
    );

    const accrualPeriodicityClass = cx(
      'fdk-padding-no',
      {
        'col-md-8': isIssued,
        'col-md-12': !isIssued
      }
    );

    return (
      <div
        id="dataset-info"
        className="row fdk-row fdk-margin-top-triple"
      >

        {issued &&
        <div className={issuedClass}>
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-upload" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.issued}</h5>
              <p id="dataset-info-issued" className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                {issued &&
                <Moment format="DD.MM.YYYY">{issued}</Moment>
                }
              </p>
            </div>
          </div>
        </div>
        }

        {accrualPeriodicity &&
        <div className={accrualPeriodicityClass}>
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-refresh" />
            </div>

            <div className="fdk-detail-text">
              <h5>{localization.dataset.frequency}</h5>
              {accrualPeriodicity &&
              <p id="dataset-info-accrualPeriodicity" className="fdk-ingress fdk-margin-bottom-no">
                {accrualPeriodicity.charAt(0).toUpperCase()}{accrualPeriodicity.substr(1)}
              </p>
              }
              {!accrualPeriodicity &&
              <p id="dataset-info-accrualPeriodicity" className="fdk-ingress fdk-margin-bottom-no">
                <span>{noTextToShow}</span>
              </p>
              }
            </div>
          </div>
        </div>
        }

        {provenance &&
        <div className="col-md-12 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-user" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.provenance}</h5>
              <p id="dataset-info-provenance" className="fdk-ingress fdk-margin-bottom-no">
                {provenance}
              </p>
            </div>
          </div>
        </div>
        }

        {hasCurrentnessAnnotation &&
        <div className="col-md-12 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-certificate" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.currentness}</h5>
              <p id="dataset-info-currentnessAnnotation" className="fdk-ingress fdk-margin-bottom-no">
                {hasCurrentnessAnnotation || noTextToShow}
              </p>
            </div>
          </div>
        </div>
        }

        { this._renderSpatial() }

        { this._renderTemporal() }

        { this._renderLanguage() }

        { this._renderReferences() }

      </div>
    );
  }
}

DatasetInfo.defaultProps = {
  issued: null,
  accrualPeriodicity: null,
  provenance: null,
  hasCurrentnessAnnotation: null,
  spatial: null,
  temporal: null,
  language: null,
  references: null,
  selectedLanguageCode: null
};

DatasetInfo.propTypes = {
  issued: PropTypes.string,
  accrualPeriodicity: PropTypes.string,
  provenance: PropTypes.string,
  hasCurrentnessAnnotation: PropTypes.string,
  spatial: PropTypes.array,
  temporal: PropTypes.array,
  language: PropTypes.array,
  references: PropTypes.array,
  selectedLanguageCode: PropTypes.string
};
