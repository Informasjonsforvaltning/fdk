import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './index.scss';

import localization from '../../components/localization';

export default class DatasetKeyInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  _renderInformationModel() {
    let informationModelNodes = null;
    const { informationModel } = this.props;
    if (typeof informationModel !== 'undefined' && informationModel.length > 0) {
      informationModelNodes = informationModel.map((item, index) => (
        <a
          key={`dataset-keyinfo-${index}`}
          href={item.uri}
        >
          {
            item.prefLabel[this.props.selectedLanguageCode]
            || item.prefLabel.nb
            || item.prefLabel.nn
            || item.prefLabel.en
          }
          <i className="fa fa-external-link fdk-fa-right" />
        </a>
      ));
      return informationModelNodes;
    }
    return '—';
  }

  _renderConformsTo() {
    let conformsToNodes = null;
    const conformsTo = this.props.conformsTo;
    if (conformsTo && conformsTo.length > 0) {
      conformsToNodes = conformsTo.map((item, index) => (
        <a
          key={`dataset-keyinfo-${index}`}
          href={item.uri}
        >
          {
            item.prefLabel[this.props.selectedLanguageCode]
            || item.prefLabel.nb
            || item.prefLabel.nn
            || item.prefLabel.en
            || localization.dataset.distribution.standard
          }
          <i className="fa fa-external-link fdk-fa-right" />
        </a>
      ));
      return conformsToNodes;
    }
    return '—';
  }

  render() {
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
    );

    return (
      <div>
        <div className="fdk-container-detail fdk-container-detail-header fdk-margin-top-double">
          <i className={accessRightClass} />
          Datasettet er {distributionPublic ? 'offentlig' : ''}
          {distributionRestricted ? 'begrenset for offentligheten' : ''}
          {distributionNonPublic ? 'skjermet for offentligheten' : ''}
        </div>

        <div className="row fdk-row">
          <div className="col-md-4 fdk-padding-no">
            <div className="fdk-container-detail">
              <div className="fdk-detail-icon">
                <i className="fa fa-upload" />
              </div>
              <div className="fdk-detail-text">
                <h5>{localization.dataset.type}</h5>
                <p className="fdk-ingress fdk-margin-bottom-no">
                  {this.props.type || '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 fdk-padding-no">
            <div className="fdk-container-detail">
              <div className="fdk-detail-icon">
                <i className="fa fa-refresh" />
              </div>
              <div className="fdk-detail-text">
                <h5>{localization.dataset.conformsTo} </h5>
                <p className="fdk-ingress fdk-margin-bottom-no">
                  {this._renderConformsTo()}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 fdk-padding-no">
            <div className="fdk-container-detail">
              <div className="fdk-detail-icon">
                <i className="fa fa-refresh" />
              </div>
              <div className="fdk-detail-text">
                <h5>{localization.dataset.informationModel}</h5>
                <p className="fdk-ingress fdk-margin-bottom-no">
                  {this._renderInformationModel()}
                </p>
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
  type: '',
  conformsTo: null,
  informationModel: []
};

DatasetKeyInfo.propTypes = {
  authorityCode: PropTypes.string,
  selectedLanguageCode: PropTypes.string,
  type: PropTypes.string,
  conformsTo: PropTypes.array,
  informationModel: PropTypes.array
};
