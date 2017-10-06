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
              <i className="fa fa-upload" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.issued}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">{this.props.issued}</p>
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
                -
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
              <p className="fdk-ingress fdk-margin-bottom-no">-</p>
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
              <p className="fdk-ingress fdk-margin-bottom-no">{this.props.language}</p>
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
