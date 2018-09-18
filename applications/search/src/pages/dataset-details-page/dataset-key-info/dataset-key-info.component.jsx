import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../lib/localization';
import { getTranslateText } from '../../../lib/translateText';
import { LinkExternal } from '../../../components/link-external/link-external.component';
import { ListRegular } from '../../../components/list-regular/list-regular.component';
import { TwoColRow } from '../../../components/list-regular/twoColRow/twoColRow';
import './dataset-key-info.scss';

const renderAccessRights = accessRight => {
  if (!accessRight) {
    return null;
  }

  const { code } = accessRight || {
    code: null
  };
  let accessRightsIconClass;
  let accessRightsLabel;

  switch (code) {
    case 'NON_PUBLIC':
      accessRightsIconClass = 'fdk-color-unntatt fa-lock';
      accessRightsLabel = localization.api.accessRight.nonPublic;
      break;
    case 'RESTRICTED':
      accessRightsIconClass = 'fdk-color-begrenset fa-unlock-alt';
      accessRightsLabel = localization.api.accessRight.restricted;
      break;
    case 'PUBLIC':
      accessRightsIconClass = 'fdk-color-offentlig fa-unlock';
      accessRightsLabel = localization.api.accessRight.public;
      break;
    default:
      accessRightsLabel = localization.api.accessRight.unknown;
  }

  return (
    <div className="row list-regular--item">
      <div className="col-4 pl-0 fdk-text-strong">
        {localization.accessLevel}
      </div>
      <div className="col-8">
        <i className={`fa fdk-fa-left ${accessRightsIconClass}`} />
        {accessRightsLabel}
      </div>
    </div>
  );
};

const renderLegalBasis = (title, legalBasis) => {
  const childrenLegalBasis = items =>
    items.map((item, index) => (
      <div key={`restriction-${item.uri}-${index}`}>
        <LinkExternal
          uri={item.uri}
          prefLabel={getTranslateText(item.prefLabel)}
        />
      </div>
    ));

  if (!legalBasis) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="row list-regular--item">
        <div className="col-4 pl-0 fdk-text-strong">{title}</div>
        <div className="col-8">{childrenLegalBasis(legalBasis)}</div>
      </div>
    </React.Fragment>
  );
};

const renderType = type => {
  if (!type) {
    return null;
  }

  return (
    <React.Fragment>
      <TwoColRow col1={localization.dataset.type} col2={type} />
    </React.Fragment>
  );
};

const renderConformsTo = conformsTo => {
  const children = items =>
    items.map(item => (
      <LinkExternal
        key={item.uri}
        uri={item.uri}
        prefLabel={getTranslateText(item.prefLabel)}
      />
    ));

  if (!(conformsTo && conformsTo.length > 0)) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="row list-regular--item">
        <div className="col-4 pl-0 fdk-text-strong">
          {localization.dataset.conformsTo}
        </div>
        <div className="col-8">{children(conformsTo)}</div>
      </div>
    </React.Fragment>
  );
};

const renderInformationModel = informationModel => {
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

  if (!(informationModel && informationModel.length > 0)) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="row list-regular--item">
        <div className="col-4 pl-0 fdk-text-strong">
          {localization.dataset.informationModel}
        </div>
        <div className="col-8">{children(informationModel)}</div>
      </div>
    </React.Fragment>
  );
};

const renderLanguage = language => {
  const children = items =>
    items.map(item => (
      <div key={item.uri}>
        <span>{getTranslateText(item.prefLabel)}</span>
      </div>
    ));

  if (!(language && language.length > 0)) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="row list-regular--item">
        <div className="col-4 pl-0 fdk-text-strong">
          {localization.dataset.language}
        </div>
        <div className="col-8">{children(language)}</div>
      </div>
    </React.Fragment>
  );
};

const renderLandingPage = landingPage => {
  const children = items =>
    items.map(item => {
      if (item) {
        return (
          <LinkExternal
            key={item}
            uri={item}
            prefLabel={localization.dataset.landingPage}
          />
        );
      }
      return null;
    });

  if (!(landingPage && landingPage.length > 0)) {
    return null;
  }

  return (
    <div className="row list-regular--item">
      <div className="col-12 pl-0">{children(landingPage)}</div>
    </div>
  );
};

const renderDatasetInfo = (
  accessRights,
  legalBasisForRestriction,
  legalBasisForProcessing,
  legalBasisForAccess,
  type,
  conformsTo,
  informationModel,
  language,
  landingPage
) => {
  if (
    !(
      accessRights ||
      legalBasisForRestriction ||
      legalBasisForProcessing ||
      legalBasisForAccess ||
      type ||
      conformsTo ||
      informationModel ||
      language ||
      landingPage
    )
  ) {
    return null;
  }

  return (
    <ListRegular title={localization.dataset.keyInfo}>
      {renderAccessRights(accessRights)}
      {renderLegalBasis(
        localization.dataset.legalBasisForRestriction,
        legalBasisForRestriction
      )}
      {renderLegalBasis(
        localization.dataset.legalBasisForProcessing,
        legalBasisForProcessing
      )}
      {renderLegalBasis(
        localization.dataset.legalBasisForAccess,
        legalBasisForAccess
      )}
      {renderType(type)}
      {renderConformsTo(conformsTo)}
      {renderInformationModel(informationModel)}
      {renderLanguage(language)}
      {renderLandingPage(landingPage)}
    </ListRegular>
  );
};

export const DatasetKeyInfo = props => {
  const {
    accessRights,
    legalBasisForRestriction,
    legalBasisForProcessing,
    legalBasisForAccess,
    type,
    conformsTo,
    informationModel,
    language,
    landingPage
  } = props;
  return (
    <section>
      {renderDatasetInfo(
        accessRights,
        legalBasisForRestriction,
        legalBasisForProcessing,
        legalBasisForAccess,
        type,
        conformsTo,
        informationModel,
        language,
        landingPage
      )}
    </section>
  );
};

DatasetKeyInfo.defaultProps = {
  accessRights: null,
  legalBasisForRestriction: null,
  legalBasisForProcessing: null,
  legalBasisForAccess: null,
  type: null,
  conformsTo: null,
  informationModel: null,
  language: null,
  landingPage: null
};

DatasetKeyInfo.propTypes = {
  accessRights: PropTypes.object,
  legalBasisForRestriction: PropTypes.array,
  legalBasisForProcessing: PropTypes.array,
  legalBasisForAccess: PropTypes.array,
  type: PropTypes.string,
  conformsTo: PropTypes.array,
  informationModel: PropTypes.array,
  language: PropTypes.array,
  landingPage: PropTypes.array
};
