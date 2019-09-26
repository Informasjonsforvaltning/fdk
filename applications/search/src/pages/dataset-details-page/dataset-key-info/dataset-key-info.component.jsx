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
  let accessRightsColorClass;
  let accessRightsLabel;

  switch (code) {
    case 'NON_PUBLIC':
      accessRightsIconClass = 'fdk-icon-non-public';
      accessRightsColorClass = 'fdk-color-unntatt';
      accessRightsLabel =
        localization.dataset.accessRights.authorityCode.nonPublicDetailsLabel;
      break;
    case 'RESTRICTED':
      accessRightsIconClass = 'fdk-icon-restricted';
      accessRightsColorClass = 'fdk-color-restricted';
      accessRightsLabel =
        localization.dataset.accessRights.authorityCode.restrictedDetailsLabel;
      break;
    case 'PUBLIC':
      accessRightsIconClass = 'fdk-icon-public';
      accessRightsColorClass = 'fdk-color-offentlig';
      accessRightsLabel =
        localization.dataset.accessRights.authorityCode.publicDetailsLabel;
      break;
    default:
      accessRightsLabel = localization.unknown;
  }

  return (
    <div className="d-flex list-regular--item">
      <div className="align-self-center col-4 pl-0 fdk-text-strong">
        {localization.accessLevel}
      </div>
      <div className="col-8 d-flex align-items-center">
        <i className={`${accessRightsIconClass} mr-3`} />
        <span className={accessRightsColorClass}>{accessRightsLabel}</span>
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
    <div className="d-flex list-regular--item">
      <div className="col-4 pl-0 fdk-text-strong">{title}</div>
      <div className="col-8">{childrenLegalBasis(legalBasis)}</div>
    </div>
  );
};

const renderType = type => {
  if (!type) {
    return null;
  }

  return <TwoColRow col1={localization.dataset.type} col2={type} />;
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
    <div className="d-flex list-regular--item">
      <div className="col-4 pl-0 fdk-text-strong">
        {localization.dataset.conformsTo}
      </div>
      <div className="col-8">{children(conformsTo)}</div>
    </div>
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
    <div className="d-flex list-regular--item">
      <div className="col-4 pl-0 fdk-text-strong">
        {localization.dataset.informationModel}
      </div>
      <div className="col-8">{children(informationModel)}</div>
    </div>
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
    <div className="d-flex list-regular--item">
      <div className="col-4 pl-0 fdk-text-strong">
        {localization.dataset.language}
      </div>
      <div className="col-8">{children(language)}</div>
    </div>
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
    <div className="d-flex list-regular--item">
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
