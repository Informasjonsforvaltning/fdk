import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Moment from 'react-moment';

import localization from '../../components/localization';

export default class DatasetInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  _renderSpatial() {
    let spatialNodes;
    const { spatial } = this.props;
    if (spatial) {
      spatialNodes = spatial.map((item, index) => (
        <span
          key={`dataset-info-spatial-${index}`}
          className="fdk-ingress fdk-margin-bottom-no"
        >
          {`${item.prefLabel[this.props.selectedLanguageCode] || item.prefLabel.nb || item.prefLabel.nn || item.prefLabel.en}, `}
        </span>
      ));
      return spatialNodes;
    }
    return null;
  }

  _renderLanguage() {
    let languageNodes;
    const language = this.props.language;
    if (language) {
      languageNodes = language.map((item, index) => (
        <p
          key={`dataset-info-language-${index}`}
          className="fdk-ingress fdk-margin-bottom-no"
        >
          {item.prefLabel[this.props.selectedLanguageCode] || item.prefLabel.nb || item.prefLabel.nn || item.prefLabel.en}
        </p>
      ));
      return languageNodes;
    }
    return null;
  }

  render() {
    return (
      <div className="row fdk-row fdk-margin-top-triple">

        <div className="col-md-4 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-upload" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.issued}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">

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
              <p className="fdk-ingress fdk-margin-bottom-no">{this.props.accrualPeriodicity}</p>
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
              <p className="fdk-ingress fdk-margin-bottom-no">{this.props.provenance}</p>
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
              <p className="fdk-ingress fdk-margin-bottom-no">
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
              <p className="fdk-ingress fdk-margin-bottom-no">
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
            <div className="fdk-detail-text">
              <h5>{localization.dataset.period}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">-</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-flag" />
            </div>
            <div className="fdk-detail-text">
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
            <div className="fdk-detail-text">
              <h5>{localization.dataset.isPartOf}</h5>
              <p className="fdk-ingress">
                <a>-<i className="fa fa-external-link fdk-fa-right" /></a>
              </p>
              <h5>Datasettet er relatert til</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">
                <a>-<i className="fa fa-external-link fdk-fa-right" /></a>
              </p>
            </div>
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
  language: PropTypes.array

};
