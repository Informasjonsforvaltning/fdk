import React from 'react';
import PropTypes from 'prop-types';
import './dataset-key-info.scss';

import localization from '../../../lib/localization';
import { getTranslateText } from '../../../lib/translateText';
import { LinkExternal } from '../../../components/link-external/link-external.component';

export class DatasetKeyInfo extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      colClass: 'col-xs-12'
    };
  }

  componentWillMount() {
    const { type, informationModel, conformsTo } = this.props;
    let countClasses = 0;
    if (type) {
      countClasses += 1;
    }
    if (informationModel && informationModel.length > 0) {
      countClasses += 1;
    }
    if (
      conformsTo &&
      typeof conformsTo !== 'undefined' &&
      conformsTo.length > 0
    ) {
      countClasses += 1;
    }
    if (countClasses > 0) {
      const colWidht = 12 / countClasses;
      const colClass = `col-xs-12 col-sm-${colWidht}`;
      this.setState = {
        colClass
      };
    }
  }

  _renderHeader() {
    const { accessRights } = this.props;
    if (accessRights) {
      const { code } = accessRights;
      return (
        <div className="fdk-container-detail fdk-container-detail-header mt-5">
          {code === 'NON_PUBLIC' && (
            <React.Fragment>
              <i className="fa fdk-fa-left fdk-color-unntatt fa-lock" />
              {
                localization.dataset.accessRights.authorityCode
                  .nonPublicDetailsLabel
              }
            </React.Fragment>
          )}
          {code === 'RESTRICTED' && (
            <React.Fragment>
              <i className="fa fdk-fa-left fa-unlock-alt fdk-color-begrenset" />
              {
                localization.dataset.accessRights.authorityCode
                  .restrictedDetailsLabel
              }
            </React.Fragment>
          )}
          {code === 'PUBLIC' && (
            <React.Fragment>
              <i className="fa fdk-fa-left fa-unlock fdk-color-offentlig" />
              {
                localization.dataset.accessRights.authorityCode
                  .publicDetailsLabel
              }
            </React.Fragment>
          )}
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

    const childrenLegalBasisForRestriction = items =>
      items.map((item, index) => (
        <div key={`restriction-${item.uri}-${index}`}>
          <LinkExternal
            uri={item.uri}
            prefLabel={getTranslateText(item.prefLabel)}
          />
        </div>
      ));

    const childrenLegalBasisForProcessing = items =>
      items.map((item, index) => (
        <div key={`processing-${item.uri}-${index}`}>
          <LinkExternal
            uri={item.uri}
            prefLabel={getTranslateText(item.prefLabel)}
          />
        </div>
      ));

    const childrenLegalBasisForAccess = items =>
      items.map((item, index) => (
        <div key={`access-${item.uri}-${index}`}>
          <LinkExternal
            uri={item.uri}
            prefLabel={getTranslateText(item.prefLabel)}
          />
        </div>
      ));

    if (
      legalBasisForProcessing ||
      legalBasisForRestriction ||
      legalBasisForAccess
    ) {
      return (
        <div className="col-xs-12 p-0">
          <div className="fdk-container-detail">
            {legalBasisForRestriction && (
              <div>
                <h5>{localization.dataset.legalBasisForRestriction}</h5>
                <div className="fdk-ingress">
                  {childrenLegalBasisForRestriction(legalBasisForRestriction)}
                </div>
              </div>
            )}

            {legalBasisForProcessing && (
              <div>
                <h5>{localization.dataset.legalBasisForProcessing}</h5>
                <div className="fdk-ingress">
                  {childrenLegalBasisForProcessing(legalBasisForProcessing)}
                </div>
              </div>
            )}

            {legalBasisForAccess && (
              <div>
                <h5>{localization.dataset.legalBasisForAccess}</h5>
                <div className="fdk-ingress">
                  {childrenLegalBasisForAccess(legalBasisForAccess)}
                </div>
              </div>
            )}
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
      <div className={`${this.state.colClass} fdk-container-detail`}>
        <h5>{heading}</h5>
        <p className="fdk-ingress mb-0">{type}</p>
      </div>
    );
  }

  _renderConformsTo() {
    const { conformsTo } = this.props;
    const header = localization.dataset.conformsTo;
    const children = items =>
      items.map(item => (
        <LinkExternal
          key={item.uri}
          uri={item.uri}
          prefLabel={getTranslateText(item.prefLabel)}
        />
      ));
    if (
      conformsTo &&
      typeof conformsTo !== 'undefined' &&
      conformsTo.length > 0
    ) {
      return (
        <div className={`${this.state.colClass} fdk-container-detail`}>
          <h5>{header}</h5>
          <p className="fdk-ingress mb-0">{children(conformsTo)}</p>
        </div>
      );
    }
    return null;
  }

  _renderInformationModel() {
    const { informationModel } = this.props;
    const children = items =>
      items.map(item => (
        <LinkExternal
          key={item.uri}
          uri={item.uri}
          prefLabel={
            getTranslateText(item.prefLabel) ||
            localization.dataset.informationModelDefaultText
          }
        />
      ));
    if (informationModel && informationModel.length > 0) {
      return (
        <div className={`${this.state.colClass} fdk-container-detail`}>
          <h5>{localization.dataset.informationModel}</h5>
          <p className="fdk-ingress mb-0">{children(informationModel)}</p>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <section>
        {this._renderHeader()}
        <div className="row fdk-row">{this._renderLegalBasis()}</div>
        <div className="row-eq-height">
          {this._renderType()}
          {this._renderInformationModel()}
          {this._renderConformsTo()}
        </div>
      </section>
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
  informationModel: null
};

DatasetKeyInfo.propTypes = {
  accessRights: PropTypes.object,
  legalBasisForRestriction: PropTypes.array,
  legalBasisForProcessing: PropTypes.array,
  legalBasisForAccess: PropTypes.array,
  type: PropTypes.string,
  conformsTo: PropTypes.array,
  informationModel: PropTypes.array
};
