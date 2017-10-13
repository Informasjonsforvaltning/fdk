import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import _sortBy from 'lodash/sortBy';

import localization from '../../components/localization';
import './index.scss';

const noTextToShow = '—';

export default class DatasetInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  _renderSpatial() {
    let spatialNodes;
    const { spatial } = this.props;
    if (spatial && typeof spatial !== 'undefined' && spatial.length > 0) {
      spatialNodes = spatial.map((item, index) => {
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
      return spatialNodes;
    }
    return noTextToShow;
  }

  _renderTemporal() {
    let temporalNodes;
    const { temporal } = this.props;
    if (temporal && temporal.length > 0) {
      temporalNodes = temporal.map((item, index) => {
        if (item.startDate && item.endDate) {
          return (
            <div
              key={`dataset-info-temporal-${index}`}
              id={`dataset-info-temporal-${index}`}
            >
              <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                <Moment format="DD.MM.YYYY">
                  {item.startDate}
                </Moment>
              </p>
              <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                <Moment format="DD.MM.YYYY">
                  {item.endDate}
                </Moment>
              </p>
            </div>
          );
        } else if (item.startDate) {
          return (
            <div
              key={`dataset-info-temporal-${index}`}
              id={`dataset-info-temporal-${index}`}
            >
              <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                <Moment format="DD.MM.YYYY">
                  {item.startDate}
                </Moment>
              </p>
            </div>
          );
        } else if (item.endDate) {
          return (
            <div
              key={`dataset-info-temporal-${index}`}
              id={`dataset-info-temporal-${index}`}
            >
              <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                <Moment format="DD.MM.YYYY">
                  {item.endDate}
                </Moment>
              </p>
            </div>
          );
        }
      });
      if (temporalNodes === null) {
        return noTextToShow;
      }
      return temporalNodes;
    }
    return noTextToShow;
  }

  _renderLanguage() {
    let languageNodes;
    const language = this.props.language;
    if (language && typeof language !== 'undefined' && language.length > 0) {
      languageNodes = language.map((item, index) => {
        if (item !== null) {
          return (
            <p
              key={`dataset-info-language-${index}`}
              id={`dataset-info-language-${index}`}
              className="fdk-ingress fdk-margin-bottom-no"
            >
              {item.prefLabel[this.props.selectedLanguageCode] || item.prefLabel.nb || item.prefLabel.nn || item.prefLabel.en}
            </p>
          );
        } else { return noTextToShow; }
      });
      if (languageNodes === null) {
        return noTextToShow;
      }
      return languageNodes;
    }
    return noTextToShow;
  }

  _renderReferences() {
    let referencesNodes;
    const { references } = this.props;
    if (typeof references !== 'undefined' && references.length > 0) {
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
    return (
      <div
        id="dataset-info"
        className="row fdk-row fdk-margin-top-triple"
      >

        <div className="col-md-4 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-upload" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.issued}</h5>
              <p id="dataset-info-issued" className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                {this.props.issued &&
                <Moment format="DD.MM.YYYY">{this.props.issued}</Moment>
                }
                {!this.props.issued &&
                <span>{noTextToShow}</span>
                }
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-8 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-refresh" />
            </div>

            <div className="fdk-detail-text">
              <h5>{localization.dataset.frequency}</h5>
              {this.props.accrualPeriodicity &&
              <p id="dataset-info-accrualPeriodicity" className="fdk-ingress fdk-margin-bottom-no">
                {this.props.accrualPeriodicity.charAt(0).toUpperCase()}{this.props.accrualPeriodicity.substr(1)}
              </p>
              }
              {!this.props.accrualPeriodicity &&
              <p id="dataset-info-accrualPeriodicity" className="fdk-ingress fdk-margin-bottom-no">
                <span>{noTextToShow}</span>
              </p>
              }
            </div>
          </div>
        </div>

        <div className="col-md-12 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-user" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.provenance}</h5>
              <p id="dataset-info-provenance" className="fdk-ingress fdk-margin-bottom-no">
                {this.props.provenance || noTextToShow}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-12 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-certificate" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.currentness}</h5>
              <p id="dataset-info-currentnessAnnotation" className="fdk-ingress fdk-margin-bottom-no">
                {this.props.hasCurrentnessAnnotation || noTextToShow}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-12 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-map" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.spatial}</h5>
              <p id="dataset-info-spatial" className="fdk-ingress fdk-margin-bottom-no">
                {this._renderSpatial()}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-8 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-calendar" />
            </div>
            <div id="dataset-info-temporal" className="fdk-detail-text">
              <div className="dataset-temporal-date">
                <h5>{localization.dataset.periodFrom}</h5>
                {this._renderTemporal()}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-flag" />
            </div>
            <div id="dataset-info-language" className="fdk-detail-text">
              <h5>{localization.dataset.language}</h5>
              {this._renderLanguage()}
            </div>
          </div>
        </div>

        {this._renderReferences()}
      </div>
    );
  }
}

DatasetInfo.defaultProps = {
  issued: null,
  accrualPeriodicity: '-',
  provenance: '-',
  hasCurrentnessAnnotation: '-',
  spatial: null,
  temporal: null,
  language: null

};

DatasetInfo.propTypes = {
  issued: PropTypes.number,
  accrualPeriodicity: PropTypes.string,
  provenance: PropTypes.string,
  hasCurrentnessAnnotation: PropTypes.string,
  spatial: PropTypes.array,
  temporal: PropTypes.array,
  language: PropTypes.array,
  isPartOf: PropTypes.array,
  references: PropTypes.array
};
