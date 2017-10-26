import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './index.scss';

import localization from '../../components/localization';

export default class DatasetKeyInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      colClass: ''
    };
  }

  componentWillMount() {
    const { type, informationModel, conformsTo } = this.props;
    let countClasses = 0;
    if (type) {
      countClasses = countClasses + 1;
    }
    if (informationModel && informationModel.length > 0) {
      countClasses = countClasses + 1;
    }
    if (conformsTo && typeof conformsTo !== 'undefined' && conformsTo.length > 0) {
      countClasses = countClasses + 1;
    }
    if (countClasses > 0) {
      const colWidht = 12 / countClasses;
      const colClass = `col-md-${colWidht}`;
      this.state = {
        colClass: colClass
      };
    }
  }

  _renderHeader() {
    const { accessRights } = this.props;
    if (accessRights) {
      const accessRightClass = cx(
        'fa fdk-fa-left',
        {
          'fdk-color-red fa-lock': accessRights.code === 'NON_PUBLIC',
          'fa-unlock-alt fdk-color-yellow': accessRights.code === 'RESTRICTED',
          'fa-unlock fdk-color-green': accessRights.code === 'PUBLIC'
        }
      );
      return (
        <div className="fdk-container-detail fdk-container-detail-header fdk-margin-top-double">
          <i className={accessRightClass} />
          {localization.dataset.accessRight} {accessRights.prefLabel.nb.toLowerCase()}
        </div>
      );
    }
    return null;
  }
  _renderLegalBasis() {
    const {
      legalBasisForRestriction,
      legalBasisForProcessing,
      legalBasisForAccess
    } = this.props;

    const childrenLegalBasisForRestriction = items => items.map(item => (
      <div
        key={item.uri}
      >
        <a
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
      </div>
    ));

    const childrenLegalBasisForProcessing = items => items.map(item => (
      <div
        key={item.uri}
      >
        <a
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
      </div>
    ));

    const childrenLegalBasisForAccess = items => items.map(item => (
      <div
        key={item.uri}
      >
        <a
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
      </div>
    ));

    if (legalBasisForProcessing || legalBasisForRestriction || legalBasisForAccess) {
      return (
        <div
          className="col-md-12 fdk-padding-no"
        >
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-institution" />
            </div>

            <div className="fdk-detail-text">

              {legalBasisForRestriction &&
              <div>
                <h5>{localization.dataset.legalBasisForRestriction}</h5>
                <div className="fdk-ingress">
                  { childrenLegalBasisForRestriction(legalBasisForRestriction) }
                </div>
              </div>
              }

              {legalBasisForProcessing &&
              <div>
                <h5>{localization.dataset.legalBasisForProcessing}</h5>
                <div className="fdk-ingress">
                  { childrenLegalBasisForProcessing(legalBasisForProcessing) }
                </div>
              </div>
              }

              {legalBasisForAccess &&
              <div>
                <h5>{localization.dataset.legalBasisForAccess}</h5>
                <div className="fdk-ingress">
                  { childrenLegalBasisForAccess(legalBasisForAccess) }
                </div>
              </div>
              }

            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  _renderType() {
    const { type } = this.props;
    if (!type) {
      return null;
    }
    const heading = localization.dataset.type;
    return (
      <div className={`${this.state.colClass} fdk-padding-no`}>
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
    const { conformsTo } = this.props;
    const header = localization.dataset.conformsTo;
    const children = items => items.map(item => (
      <a
        key={item.uri}
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
    if (conformsTo && typeof conformsTo !== 'undefined' && conformsTo.length > 0) {
      return (
        <div
          className={`${this.state.colClass} fdk-padding-no`}
        >
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-refresh" />
            </div>
            <div className="fdk-detail-text">
              <h5>{header}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">
                { children(conformsTo) }
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  _renderInformationModel() {
    const { informationModel } = this.props;
    const children = items => items.map(item => (
      <a
        key={item.uri}
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
    if (informationModel && informationModel.length > 0) {
      return (
        <div
          className={`${this.state.colClass} fdk-padding-no`}
        >
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon">
              <i className="fa fa-refresh" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.informationModel}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">
                { children(informationModel) }
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div>
        { this._renderHeader() }
        <div className="row fdk-row">
          {this._renderLegalBasis()}
          {this._renderType()}
          {this._renderInformationModel()}
          {this._renderConformsTo()}
        </div>
      </div>
    );
  }
}

DatasetKeyInfo.defaultProps = {
  accessRights: null,
  legalBasisForRestriction: null,
  legalBasisForProcessing: null,
  legalBasisForAccess: null,
  type: null,
  conformsTo: null,
  informationModel: null,
  selectedLanguageCode: ''
};

DatasetKeyInfo.propTypes = {
  accessRights: PropTypes.object,
  legalBasisForRestriction: PropTypes.array,
  legalBasisForProcessing: PropTypes.array,
  legalBasisForAccess: PropTypes.array,
  type: PropTypes.string,
  conformsTo: PropTypes.array,
  informationModel: PropTypes.array,
  selectedLanguageCode: PropTypes.string
};
