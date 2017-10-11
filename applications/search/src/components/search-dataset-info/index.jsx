import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import _sortBy from 'lodash/sortBy';

import localization from '../../components/localization';
import './index.scss';

const noTextToShow = '-';

export default class DatasetInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  _renderSpatial() {
    let spatialNodes;
    const { spatial } = this.props;
    if (spatial) {
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
    if (temporal) {
      temporalNodes = temporal.map((item, index) => {
        if (item.startDate && item.endDate) {
          return (
            <div
              key={`dataset-info-temporal-${index}`}
              id={`dataset-info-temporal-${index}`}
              className="fdk-detail-text"
            >
              <div
                className="dataset-temporal-date"
              >
                <h5>{localization.dataset.periodFrom}</h5>
                <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                  <Moment format="DD.MM.YYYY">
                    {item.startDate}
                  </Moment>
                </p>
              </div>
              <div className="dataset-temporal-date ml-1">
                <h5>{localization.dataset.periodTo}</h5>
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
              <h5>{localization.dataset.periodFrom}</h5>
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
              <h5>{localization.dataset.periodTo}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                <Moment format="DD.MM.YYYY">
                  {item.endDate}
                </Moment>
              </p>
            </div>
          );
        }
      });
      return temporalNodes;
    }
    return noTextToShow;
  }

  _renderLanguage() {
    let languageNodes;
    const language = this.props.language;
    if (language) {
      languageNodes = language.map((item, index) => (
        <p
          key={`dataset-info-language-${index}`}
          id={`dataset-info-language-${index}`}
          className="fdk-ingress fdk-margin-bottom-no"
        >
          {item.prefLabel[this.props.selectedLanguageCode] || item.prefLabel.nb || item.prefLabel.nn || item.prefLabel.en}
        </p>
      ));
      return languageNodes;
    }
    return noTextToShow;
  }

  _renderReferences() {
    let referencesNodes;
    const { references } = this.props;

    if (references) {
      let groupReferences = references;
      groupReferences = _sortBy(references, o => o.referenceType.code); // sort array by referenceType.code

      let referenceTypeCode = '';
      referencesNodes = groupReferences.map((item, index) => {
        if (item.referenceType.code !== referenceTypeCode) {
          referenceTypeCode = item.referenceType.code;
          return (
            <div
              key={`dataset-${index}`}
            >
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
          );
        }
        return (
          <p
            key={`dataset-${index}`}
            className="fdk-ingress"
          >
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
                <span>-</span>
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
              <p id="dataset-info-accrualPeriodicity" className="fdk-ingress fdk-margin-bottom-no">
                {this.props.accrualPeriodicity.charAt(0).toUpperCase()}{this.props.accrualPeriodicity.substr(1)}
              </p>
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
              <p id="dataset-info-provenance" className="fdk-ingress fdk-margin-bottom-no">{this.props.provenance}</p>
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
                {this.props.hasCurrentnessAnnotation}
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
            <div id="dataset-info-temporal">
              {this._renderTemporal()}
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

        <div className="col-md-12 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-link" />
            </div>
            {this.props.references &&
            <div className="fdk-detail-text refer">
              {this._renderReferences()}
            </div>
            }
          </div>
        </div>
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
