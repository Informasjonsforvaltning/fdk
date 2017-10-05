import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './index.scss';

import localization from '../../components/localization';

export default class DatasetKeyInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const language = this.props.selectedLanguageCode;

    let distribution_non_public = false;
    let distribution_restricted = false;
    let distribution_public = false;
    if (this.props.accessRights && this.props.authorityCode === 'NON_PUBLIC') {
      distribution_non_public = true;
    } else if (this.props.accessRights && this.props.authorityCode === 'RESTRICTED') {
      distribution_restricted = true;
    } else if (this.props.accessRights && this.props.authorityCode === 'PUBLIC') {
      distribution_public = true;
    } else if (!this.props.accessRights) { // antar public hvis authoritycode mangler
      distribution_public = true;
    }

    const accessRightClass = cx(
      'fa fdk-fa-left',
      {
        'fdk-color-green fa-unlock': distribution_public,
        'fa-lock fdk-color-orange': distribution_restricted,
        'fa-lock fdk-color-red': distribution_non_public
      }
    )

    return (
      <div>
        <div className="fdk-container-detail fdk-container-detail-header fdk-margin-top-double">
          <i className={accessRightClass} />
            Datasettet er {distribution_public ? 'offentlig':''}
             {distribution_restricted ? 'begrenset':''}
             {distribution_non_public ? 'ikke offentlig':''}
        </div>
        <div className="row fdk-row">
          <div className="col-md-6 fdk-padding-no">
              <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                      <i className="fa fa-upload"></i>
                  </div>
                  <div className="fdk-detail-text">
                      <h5>Type</h5>
                      <p className="fdk-ingress fdk-margin-bottom-no">{this.props.type}</p>
                  </div>
              </div>
          </div>

          <div className="col-md-6 fdk-padding-no">
              <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                      <i className="fa fa-refresh"></i>
                  </div>
                  <div className="fdk-detail-text">
                      <h5>Innholdsstandard </h5>
                      <p className="fdk-ingress fdk-margin-bottom-no">
                      {this.props.conformsTo && this.props.conformsTo.length !== 0 ? this.props.conformsTo
                        .map((t, i) => <span key={i}>{t}</span>)
                        .reduce((prev, curr) => [prev, ', ', curr]) : ''}
                        </p>
                  </div>
              </div>
          </div>

          <div className="col-md-12 fdk-padding-no">
              <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                      <i className="fa fa-user"></i>
                  </div>
                  <div className="fdk-detail-text legal-basis">
                      <h5>Skjermingshjemmel</h5>
                      <ul className="fdk-ingress fdk-margin-bottom-no">{this.props.legalBasisForRestrictions && this.props.legalBasisForRestrictions.length !== 0 ?
                        this.props.legalBasisForRestrictions.map((t, i) =>
                          <li key={i}>
                            <a href={t.source}>
                              {t.prefLabel.nb} <i className="fa fa-external-link" aria-hidden="true"></i>
                            </a>
                          </li>
                        )
                        : ''
                      }</ul>
                      <h5>Behandlingsgrunnlag</h5>
                      <ul className="fdk-ingress fdk-margin-bottom-no">{this.props.legalBasisForProcessings && this.props.legalBasisForProcessings.length !== 0 ?
                        this.props.legalBasisForProcessings.map((t, i) =>
                          <li key={i}>
                            <a href={t.source}>
                              {t.prefLabel.nb} <i className="fa fa-external-link" aria-hidden="true"></i>
                            </a>
                          </li>
                        )
                        : ''
                      }</ul>
                      <h5>Utleveringshjemmel</h5>
                      <ul className="fdk-ingress fdk-margin-bottom-no">{this.props.legalBasisForAccesses && this.props.legalBasisForAccesses.length !== 0 ?
                        this.props.legalBasisForAccesses.map((t, i) =>
                          <li key={i}>
                            <a href={t.source}>
                              {t.prefLabel.nb} <i className="fa fa-external-link" aria-hidden="true"></i>
                            </a>
                          </li>
                        )
                        : ''
                      }</ul>
                  </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

DatasetKeyInfo.defaultProps = {
  authorityCode: 'PUBLIC',
  selectedLanguageCode: null,
  type:'',
  conformsTo:[],
  legalBasisForRestrictions:[]
};

DatasetKeyInfo.propTypes = {
  authorityCode: PropTypes.string,
  selectedLanguageCode: PropTypes.string,
  type: PropTypes.string,
  conformsTo: PropTypes.array,
  legalBasisForRestrictions: PropTypes.array
};
