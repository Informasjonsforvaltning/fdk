import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DocumentMeta from 'react-document-meta';

import localization from '../../lib/localization';
import { getTranslateText } from '../../lib/translateText';
import { HarvestDate } from '../../components/harvest-date/harvest-date.component';
import { SearchHitHeader } from '../../components/search-hit-header/search-hit-header.component';
import ApiUsageInstruction from './api-usage-instruction/api-usage-instruction.component';
import { ApiEndpoints } from './api-endpoints/api-endpoints.component';
import { ShowMore } from '../../components/show-more/show-more';
import { StickyMenu } from '../../components/sticky-menu/sticky-menu.component';
import { ListRegular } from '../../components/list-regular/list-regular.component';
import { TwoColRow } from '../../components/list-regular/twoColRow/twoColRow';
import { DatasetReference } from './dataset-reference/dataset-reference.component';
import { InformationModelReference } from './informationmodel-reference/informationmodel-reference.component';
import { convertToSanitizedHtml } from '../../lib/markdown-converter';
import './api-details-page.scss';
import { AlertMessage } from '../../components/alert-message/alert-message.component';
import {
  iconIsFree,
  iconIsNotFree,
  iconIsNotOpenAccess,
  iconIsNotOpenLicense,
  iconIsOpenAccess,
  iconIsOpenLicense
} from '../../components/api-icons';
import {
  getReferenceDataByCode,
  REFERENCEDATA_PATH_APISERVICETYPE
} from '../../redux/modules/referenceData';

const renderDescription = descriptionFormatted => {
  if (!descriptionFormatted) {
    return null;
  }

  return (
    <ShowMore showMoreButtonText={localization.showFullDescription}>
      <div
        dangerouslySetInnerHTML={{
          __html: convertToSanitizedHtml(descriptionFormatted)
        }}
      />
    </ShowMore>
  );
};

const renderFormats = formats => {
  if (!formats || formats.length === 0) {
    return null;
  }
  const formatItems = formats =>
    formats.map((item, index) => (
      <span key={index}>
        {index > 0 ? ', ' : ''}
        {item}
      </span>
    ));
  return (
    <ListRegular title={localization.format}>
      <div className="d-flex list-regular--item">{formatItems(formats)}</div>
    </ListRegular>
  );
};

const renderApiUsageInstruction = (servers, apiSpecUrl, apiDocUrl) =>
  servers &&
  servers.length && (
    <ApiUsageInstruction
      servers={servers}
      apiSpecUrl={apiSpecUrl}
      apiDocUrl={apiDocUrl}
    />
  );

const renderApiEndpoints = (paths, apiSpecUrl, apiDocUrl) => {
  if (!paths) {
    return null;
  }
  return (
    <ApiEndpoints
      name={localization.api.endpoints.operations}
      paths={paths}
      apiSpecUrl={apiSpecUrl}
      apiDocUrl={apiDocUrl}
    />
  );
};

const renderAPIInfo = ({ children }) => {
  if (!children) {
    return null;
  }
  return <ListRegular title={localization.apiInfo}>{children}</ListRegular>;
};

const renderDatasetReferences = references => {
  if (!references || (references && references.length === 0)) {
    return null;
  }
  const children = items =>
    items.map((item, index) => (
      <DatasetReference
        key={`${index}-${item.id}`}
        datasetReference={item}
        index={index}
      />
    ));
  return (
    <ListRegular title={localization.datasetReferences}>
      {children(references)}
    </ListRegular>
  );
};

const renderInformationModelReferences = informationModels => {
  if (
    !Array.isArray(informationModels) ||
    (informationModels && informationModels.length === 0)
  ) {
    return null;
  }
  const children = items =>
    items.map((item, index) => (
      <InformationModelReference
        key={`${index}-${item.id}`}
        informationModelReference={item}
        index={index}
      />
    ));
  return (
    <ListRegular title={localization.informationModelReferences}>
      {children(informationModels)}
    </ListRegular>
  );
};

const getContactPointKey = contactPoint =>
  contactPoint &&
  (contactPoint.uri ||
    contactPoint.organizationName ||
    contactPoint.email ||
    contactPoint.phone);

const renderContactPoint = contactPoint => {
  const { uri, organizationName, email, phone } = contactPoint;
  return (
    <React.Fragment key={getContactPointKey(contactPoint)}>
      {(uri || organizationName) && (
        <TwoColRow
          col1={localization.contactPoint}
          col2={
            uri ? (
              <a href={uri}>
                {organizationName || uri}
                <i className="fa fa-external-link fdk-fa-right" />
              </a>
            ) : (
              organizationName
            )
          }
        />
      )}
      {email && (
        <TwoColRow
          col1={localization.email}
          col2={
            <a title={email} href={`mailto:${email}`} rel="noopener noreferrer">
              {email}
            </a>
          }
        />
      )}
      {phone && <TwoColRow col1={localization.phone} col2={phone} />}
    </React.Fragment>
  );
};

const renderContactPoints = contactPoints => {
  if (
    !contactPoints ||
    !Array.isArray(contactPoints) ||
    contactPoints.length < 1 ||
    !contactPoints.some(getContactPointKey)
  ) {
    return null;
  }

  const children = items => items.map(item => renderContactPoint(item));

  return (
    <ListRegular title={localization.contactInfo}>
      {children(contactPoints)}
    </ListRegular>
  );
};

const renderTermsAndRestrictions = (
  termsOfService,
  license,
  cost,
  usageLimitation,
  performance,
  availability
) => {
  if (
    !(
      termsOfService ||
      license ||
      cost ||
      usageLimitation ||
      performance ||
      availability
    )
  ) {
    return null;
  }

  return (
    <ListRegular
      title={localization.api.termsAndRestrictions.termsAndRestrictions}
    >
      {termsOfService && (
        <TwoColRow
          col1={localization.api.termsAndRestrictions.termsOfService}
          col2={
            <a href={termsOfService}>
              {termsOfService}
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
          }
        />
      )}
      {license && (
        <TwoColRow
          col1={localization.api.termsAndRestrictions.license}
          col2={
            <a href={_.get(license, 'url')}>
              {_.get(license, 'name')}
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
          }
        />
      )}
      {cost && (
        <TwoColRow
          col1={localization.api.termsAndRestrictions.cost}
          col2={cost}
        />
      )}
      {usageLimitation && (
        <TwoColRow
          col1={localization.api.termsAndRestrictions.usageLimitation}
          col2={usageLimitation}
        />
      )}
      {performance && (
        <TwoColRow
          col1={localization.api.termsAndRestrictions.performance}
          col2={performance}
        />
      )}
      {availability && (
        <TwoColRow
          col1={localization.api.termsAndRestrictions.availability}
          col2={availability}
        />
      )}
    </ListRegular>
  );
};

const renderStickyMenu = (apiItem, informationModels) => {
  const menuItems = [];
  if (_.get(apiItem, 'description')) {
    menuItems.push({
      name: getTranslateText(_.get(apiItem, 'title')),
      prefLabel: localization.description
    });
  }
  if (_.get(apiItem, 'formats', []).length > 0) {
    menuItems.push({
      name: localization.format,
      prefLabel: localization.format
    });
  }
  if (_.get(apiItem, ['apiSpecification', 'servers'], []).length) {
    menuItems.push({
      name: localization.api.servers.title,
      prefLabel: localization.api.servers.title
    });
  }
  if (_.get(apiItem, ['apiSpecification', 'paths'])) {
    menuItems.push({
      name: localization.api.endpoints.operations,
      prefLabel: localization.api.endpoints.operations
    });
  }
  if (_.get(apiItem, 'serviceType')) {
    menuItems.push({
      name: localization.serviceType,
      prefLabel: localization.serviceType
    });
  }
  if (
    _.get(apiItem, ['apiSpecification', 'info', 'termsOfService']) ||
    _.get(apiItem, ['apiSpecification', 'info', 'license']) ||
    _.get(apiItem, 'cost') ||
    _.get(apiItem, 'usageLimitation') ||
    _.get(apiItem, 'performance') ||
    _.get(apiItem, 'availability')
  ) {
    menuItems.push({
      name: localization.api.termsAndRestrictions.termsAndRestrictions,
      prefLabel: localization.api.termsAndRestrictions.termsAndRestrictions
    });
  }
  if (_.get(apiItem, 'datasetReferences')) {
    menuItems.push({
      name: localization.datasetReferences,
      prefLabel: localization.datasetReferences
    });
  }
  if (Array.isArray(informationModels) && informationModels.length > 0) {
    menuItems.push({
      name: localization.informationModelReferences,
      prefLabel: localization.informationModelReferences
    });
  }
  if (_.get(apiItem, 'contactPoint')) {
    menuItems.push({
      name: localization.contactInfo,
      prefLabel: localization.contactInfo
    });
  }
  return <StickyMenu title={localization.goTo} menuItems={menuItems} />;
};

const renderServiceType = (serviceType, referenceData) => {
  if (!serviceType) {
    return null;
  }
  const referenceDataServiceTypeItem = getReferenceDataByCode(
    referenceData,
    REFERENCEDATA_PATH_APISERVICETYPE,
    serviceType
  );
  return (
    <ListRegular title={localization.serviceType}>
      <TwoColRow
        col1={localization.serviceType}
        col2={getTranslateText(
          _.get(referenceDataServiceTypeItem, 'prefLabel')
        )}
      />
    </ListRegular>
  );
};

const renderExpiredOrDeprecatedVersion = item => {
  const statusCode = _.get(item, 'statusCode');
  const deprecationInfoExpirationDate = _.get(
    item,
    'deprecationInfoExpirationDate'
  );
  const deprecationInfoReplacedWithUrl = _.get(
    item,
    'deprecationInfoReplacedWithUrl'
  );
  if (statusCode === 'REMOVED') {
    return (
      <AlertMessage type="info">
        <span>{localization.statusRemoved} </span>
        {deprecationInfoReplacedWithUrl && (
          <a href={deprecationInfoReplacedWithUrl}>
            {localization.statusReplacedUrl}
          </a>
        )}
      </AlertMessage>
    );
  }
  if (statusCode === 'DEPRECATED') {
    return (
      <AlertMessage type="info">
        <span>
          {deprecationInfoExpirationDate &&
            localization.formatString(
              localization.statusDeprecated,
              localization.during,
              deprecationInfoExpirationDate.substring(0, 4)
            )}
          {!deprecationInfoExpirationDate &&
            localization.formatString(localization.statusDeprecated, '', '')}
        </span>

        {deprecationInfoReplacedWithUrl && (
          <a href={deprecationInfoReplacedWithUrl}>
            {localization.statusReplacedUrl}
          </a>
        )}
      </AlertMessage>
    );
  }
  return null;
};

export const ApiDetailsPage = ({
  apiItem,
  publisherItems,
  referencedDatasets,
  referencedInformationModels,
  referenceData,
  fetchPublishersIfNeeded,
  fetchApiStatusIfNeeded,
  fetchApiServiceTypeIfNeeded
}) => {
  if (!apiItem) {
    return null;
  }

  fetchPublishersIfNeeded();
  fetchApiStatusIfNeeded();
  fetchApiServiceTypeIfNeeded();

  const internalApiSpecUrl = `/api/apis/${apiItem.id}/spec`;

  const meta = {
    title: getTranslateText(apiItem.title),
    description: getTranslateText(apiItem.description)
  };

  const { isFree, isOpenAccess, isOpenLicense } = apiItem;

  return (
    <main id="content" className="container">
      <article>
        <div className="row">
          <div className="col-12 col-lg-8 offset-lg-4">
            <DocumentMeta {...meta} />

            <div className="d-flex fdk-detail-date mb-5">
              <i className="align-self-center fdk-icon-catalog-api mr-2" />
              <strong className="align-self-center">
                {localization.api.apiDescription}&nbsp;
              </strong>
              <HarvestDate
                className="align-self-center"
                harvest={apiItem.harvest}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-4 ">
            {renderStickyMenu(apiItem, referencedInformationModels)}
          </div>

          <section className="col-12 col-lg-8 mt-3 api-details-section">
            <div name={getTranslateText(apiItem.title)}>
              <SearchHitHeader
                title={getTranslateText(apiItem.title)}
                publisherLabel={`${localization.provider}:`}
                publisher={apiItem.publisher}
                publisherItems={publisherItems}
                nationalComponent={apiItem.nationalComponent}
                statusCode={apiItem.statusCode}
                referenceData={referenceData}
                darkThemeBackground
              />
              {renderExpiredOrDeprecatedVersion(apiItem)}

              {renderDescription(
                apiItem.descriptionFormatted || apiItem.description
              )}
              <div className="access-icons mb-5 d-flex justify-content-between">
                {isFree === true && iconIsFree()}
                {isFree === false && iconIsNotFree()}
                {isOpenAccess === true && iconIsOpenAccess()}
                {isOpenAccess === false && iconIsNotOpenAccess()}
                {isOpenLicense === true && iconIsOpenLicense()}
                {isOpenLicense === false && iconIsNotOpenLicense()}
              </div>
            </div>

            {renderFormats(apiItem.formats)}

            {renderApiUsageInstruction(
              _.get(apiItem, ['apiSpecification', 'servers'], []),
              apiItem.apiSpecUrl || internalApiSpecUrl,
              apiItem.apiDocUrl
            )}

            {renderApiEndpoints(
              apiItem.apiSpecification && apiItem.apiSpecification.paths
            )}

            {renderAPIInfo({})}

            {renderTermsAndRestrictions(
              _.get(apiItem, ['apiSpecification', 'info', 'termsOfService']),
              _.get(apiItem, ['apiSpecification', 'info', 'license']),
              _.get(apiItem, 'cost'),
              _.get(apiItem, 'usageLimitation'),
              _.get(apiItem, 'performance'),
              _.get(apiItem, 'availability')
            )}

            {renderServiceType(_.get(apiItem, 'serviceType'), referenceData)}

            {renderDatasetReferences(referencedDatasets)}

            {renderInformationModelReferences(referencedInformationModels)}

            {renderContactPoints(apiItem.contactPoint)}
            <div style={{ height: '75vh' }} />
          </section>
        </div>
      </article>
    </main>
  );
};

ApiDetailsPage.defaultProps = {
  apiItem: null,
  publisherItems: null,
  referenceData: null,
  fetchPublishersIfNeeded: () => {},
  fetchApiStatusIfNeeded: _.noop,
  fetchApiServiceTypeIfNeeded: _.noop,
  referencedDatasets: []
};

ApiDetailsPage.propTypes = {
  apiItem: PropTypes.object,
  publisherItems: PropTypes.object,
  referenceData: PropTypes.object,
  fetchPublishersIfNeeded: PropTypes.func,
  fetchApiStatusIfNeeded: PropTypes.func,
  fetchApiServiceTypeIfNeeded: PropTypes.func,
  referencedDatasets: PropTypes.array
};
