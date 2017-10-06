import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './index.scss';

import localization from '../../components/localization';

export default class DatasetKeyInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    console.log(JSON.stringify(this.props.authorityCode));
    const language = this.props.selectedLanguageCode;


    let distributionNonPublic = false;
    let distributionRestricted = false;
    let distributionPublic = false;
    let authorityCode = '';

    if (this.props.authorityCode) {
      authorityCode = this.props.authorityCode;
    }

    if (authorityCode === 'NON_PUBLIC') {
      distributionNonPublic = true;
    } else if (authorityCode === 'RESTRICTED') {
      distributionRestricted = true;
    } else if (authorityCode === 'PUBLIC') {
      distributionPublic = true;
    } else { // antar public hvis authoritycode mangler
      distributionPublic = true;
    }

    const accessRightClass = cx(
      'fa fdk-fa-left',
      {
        'fdk-color-green fa-unlock': distributionPublic,
        'fa-unlock-alt fdk-color-yellow': distributionRestricted,
        'fa-lock fdk-color-red': distributionNonPublic
      }
    )

    return (
      <div>
        <div className="fdk-container-detail fdk-container-detail-header fdk-margin-top-double">
          <i className={accessRightClass} />
          Datasettet er {distributionPublic ? 'offentlig':''}
          {distributionRestricted ? 'begrenset for offentligheten':''}
          {distributionNonPublic ? 'skjermet for offentligheten':''}
        </div>
        <div className="row fdk-row">
          <div className="col-md-6 fdk-padding-no">
            <div className="fdk-container-detail">
              <div className="fdk-detail-icon">
                <i className="fa fa-upload"></i>
              </div>
              <div className="fdk-detail-text">
                <h5>Type</h5>
                <p className="fdk-ingress fdk-margin-bottom-no">{this.props.type || '—'}</p>
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
                      .reduce((prev, curr) => [prev, ', ', curr]) : '—'}
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
                  : '—'
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
                  : '—'
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
                  : '—'
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
