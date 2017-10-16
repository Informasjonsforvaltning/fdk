import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './index.scss';

import localization from '../../components/localization';

export default class DatasetKeyInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  _renderType() {
    const { type } = this.props;
    if (!type) {
      return null;
    }
    const heading = localization.dataset.type;
    return (
      <div className="col-md-4 fdk-padding-no">
        <div className="fdk-container-detail">
          <div className="fdk-detail-icon">
            <i className="fa fa-upload" />
          </div>
          <div className="fdk-detail-text">
            <h5>{heading}</h5>
            <p className="fdk-ingress fdk-margin-bottom-no">
              {type}
            </p>
          </div>
        </div>
      </div>
    );
  }

  _renderConformsTo() {
    let conformsToNodes = null;
    const { conformsTo } = this.props;
    const header = localization.dataset.conformsTo;
    if (conformsTo && typeof conformsTo !== 'undefined' && conformsTo.length > 0) {
      conformsToNodes = conformsTo.map((item, index) => (
        <div
          key={`dataset-keyinfo-${index}`}
          className="col-md-12 fdk-padding-no"
        >
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-refresh" />
            </div>
            <div className="fdk-detail-text">
              <h5>{header}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">
                <a href={item.uri}>
                  {
                    item.prefLabel[this.props.selectedLanguageCode]
                    || item.prefLabel.nb
                    || item.prefLabel.nn
                    || item.prefLabel.en
                    || localization.dataset.distribution.standard
                  }
                  <i className="fa fa-external-link fdk-fa-right" />
                </a>
              </p>
            </div>
          </div>
        </div>
      ));
      return conformsToNodes;
    }
    return null;
  }

  _renderInformationModel() {
    let informationModelNodes = null;
    const { informationModel } = this.props;
    if (typeof informationModel !== 'undefined' && informationModel.length > 0) {
      informationModelNodes = informationModel.map((item, index) => (
        <div
          key={`dataset-keyinfo-${index}`}
          className="col-md-4 fdk-padding-no"
        >
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-refresh" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.informationModel}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">
                <a

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
              </p>
            </div>
          </div>
        </div>
      ));
      return informationModelNodes;
    }
    return null;
  }

  render() {
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
          {this._renderType()}
          {this._renderInformationModel()}
          {this._renderConformsTo()}
        </div>
      </div>
    );
  }
}

DatasetKeyInfo.defaultProps = {
  authorityCode: 'PUBLIC',
  selectedLanguageCode: null,
  type: null,
  conformsTo: null,
  informationModel: null
};

DatasetKeyInfo.propTypes = {
  authorityCode: PropTypes.string,
  type: PropTypes.string,
  conformsTo: PropTypes.array,
  informationModel: PropTypes.array,
  selectedLanguageCode: PropTypes.string
};
