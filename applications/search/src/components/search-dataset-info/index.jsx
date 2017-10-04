import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../components/localization';

export default class DatasetInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function


  render() {
    return (
      <div className="row fdk-row fdk-margin-top-triple">
        <div className="col-md-4 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-upload"></i>
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.detail.issued}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">{this.props.issued}</p>
            </div>
          </div>
        </div>

        <div className="col-md-8 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-refresh"></i>
            </div>
            <div className="fdk-detail-text">
              <h5>Oppdateringsfrekvens {localization.detail.frequency}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">{this.props.accrualPeriodicity}</p>
            </div>
          </div>
        </div>

        <div className="col-md-12 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-user"></i>
            </div>
            <div className="fdk-detail-text">
              <h5>Opphav {localization.detail.provenance}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">TODO: {this.props.provenance}</p>
            </div>
          </div>
        </div>

        <div className="col-md-12 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-certificate"></i>
            </div>
            <div className="fdk-detail-text">
              <h5>Aktualitet {localization.detail.issued}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">
                TODO: Tekst for aktualitet
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-12 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-map"></i>
            </div>
            <div className="fdk-detail-text">
              <h5>Geografisk avgrenset til {localization.detail.spatial}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">TODO: Asker, Bærum, Hurum, Røyken</p>
            </div>
          </div>
        </div>

        <div className="col-md-8 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-calendar"></i>
            </div>
            <div className="fdk-detail-text">
              <h5>TODO: Tidsmessig avgrenset fra {localization.detail.period}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">TODO: 01.01.2001</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-flag"></i>
            </div>
            <div className="fdk-detail-text">
              <h5>Språk {localization.detail.language}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">{this.props.language}</p>
            </div>
          </div>
        </div>

        <div className="col-md-12 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-link"></i>
            </div>
            <div className="fdk-detail-text">
              <h5>Datasettet er en del av {localization.detail.isPartOf}</h5>
              <p className="fdk-ingress">
                TODO:
                <a>Dybdedata<i className="fa fa-external-link fdk-fa-right" /></a>
                <a>Dybdedata 50m grid<i className="fa fa-external-link fdk-fa-right" /></a>
              </p>
              <h5>TODO: Datasettet er relatert til {localization.detail.issued}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">
                TODO:
                <a>Navn fra Sentralt Stedsnavnsregister (SSR)<i className="fa fa-external-link fdk-fa-right" /></a>
              </p>
            </div>
          </div>
        </div>


      </div>
    );
  }
}

DatasetInfo.defaultProps = {
  issued: '-',
  accrualPeriodicity: '-',
  provenance: '-',
  language: '-'

};

DatasetInfo.propTypes = {
  issued: PropTypes.string,
  accrualPeriodicity: PropTypes.string,
  provenance: PropTypes.string,
  language: PropTypes.string

};
