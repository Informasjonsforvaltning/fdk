import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DocumentMeta from 'react-document-meta';
import Disqus from 'disqus-react';
import sanitizeHtml from 'sanitize-html';
import showdown from 'showdown';

import localization from '../../lib/localization';
import { getTranslateText } from '../../lib/translateText';
import { HarvestDate } from '../../components/harvest-date/harvest-date.component';
import { SearchHitHeader } from '../../components/search-hit-header/search-hit-header.component';
import { ApiEndpoints } from './api-endpoints/api-endpoints.component';
import { ShowMore } from '../../components/show-more/show-more';
import { StickyMenu } from '../../components/sticky-menu/sticky-menu.component';
import { ListRegular } from '../../components/list-regular/list-regular.component';
import { TwoColRow } from '../../components/list-regular/twoColRow/twoColRow';
import { DatasetReference } from './dataset-reference/dataset-reference.component';
import { InformationModelReference } from './informationmodel-reference/informationmodel-reference.component';
import { config } from '../../config';

const showDownConverter = new showdown.Converter();

const renderDescription = descriptionFormatted => {
  if (!descriptionFormatted) {
    return null;
  }

  const unsanitizedHtml = showDownConverter.makeHtml(descriptionFormatted);
  const sanitizedHtml = sanitizeHtml(unsanitizedHtml);

  return (
    <ShowMore showMoreButtonText={localization.showFullDescription}>
      <span
        dangerouslySetInnerHTML={{
          __html: sanitizedHtml
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
      {uri && (
        <TwoColRow
          col1={localization.contactPoint}
          col2={
            uri ? (
              <a href={uri}>
                {organizationName || uri}
                <i className="fa fa-external-link fdk-fa-right" />
              </a>
            ) : (
              { organizationName }
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
  if (_.get(apiItem, ['apiSpecification', 'paths'])) {
    menuItems.push({
      name: localization.api.endpoints.operations,
      prefLabel: localization.api.endpoints.operations
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
  return <StickyMenu menuItems={menuItems} />;
};

export const ApiDetailsPage = props => {
  props.fetchPublishersIfNeeded();

  const {
    apiItem,
    publisherItems,
    referencedDatasets,
    referencedInformationModels
  } = props;
  if (!apiItem) {
    return null;
  }

  const internalApiSpecUrl = `/api/apis/${apiItem.id}/spec`;

  const meta = {
    title: getTranslateText(apiItem.title),
    description: getTranslateText(apiItem.description)
  };

  const disqusConfig = {
    url: window.location.href,
    identifier: apiItem.id,
    title: meta.title
  };

  return (
    <main id="content" className="container">
      <article>
        <div className="row">
          <div className="col-12 col-lg-8 offset-lg-4">
            <DocumentMeta {...meta} />
            <HarvestDate harvest={apiItem.harvest} />

            <SearchHitHeader
              title={getTranslateText(apiItem.title)}
              publisherLabel={localization.api.provider}
              publisher={apiItem.publisher}
              publisherItems={publisherItems}
              nationalComponent={apiItem.nationalComponent}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-4 ">
            {renderStickyMenu(apiItem, referencedInformationModels)}
          </div>

          <section className="col-12 col-lg-8 mt-3">
            {renderDescription(
              apiItem.descriptionFormatted || apiItem.description
            )}

            {renderFormats(apiItem.formats)}

            {renderApiEndpoints(
              apiItem.apiSpecification && apiItem.apiSpecification.paths,
              apiItem.apiSpecUrl || internalApiSpecUrl,
              apiItem.apiDocUrl
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

            {renderDatasetReferences(referencedDatasets)}

            {renderInformationModelReferences(referencedInformationModels)}

            {renderContactPoints(apiItem.contactPoint)}
            {config.disqusShortname && (
              <Disqus.DiscussionEmbed
                shortname={config.disqusShortname}
                config={disqusConfig}
              />
            )}
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
  fetchPublishersIfNeeded: () => {}
};

ApiDetailsPage.propTypes = {
  apiItem: PropTypes.object,
  publisherItems: PropTypes.object,
  fetchPublishersIfNeeded: PropTypes.func
};
