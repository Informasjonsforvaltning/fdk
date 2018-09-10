import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DocumentMeta from 'react-document-meta';

import localization from '../../lib/localization';
import { getTranslateText } from '../../lib/translateText';
import { HarvestDate } from '../../components/harvest-date/harvest-date.component';
import { SearchHitHeader } from '../../components/search-hit-header/search-hit-header.component';
import { ApiEndpoints } from './api-endpoints/api-endpoints.component';
import { ShowMore } from '../../components/show-more/show-more';
import { StickyMenu } from '../../components/sticky-menu/sticky-menu.component';
import { ListType1 } from '../../components/listType1/listType1';
import { TwoColRow } from '../../components/listType1/twoColRow/twoColRow';

const renderDescription = description => {
  if (!description) {
    return null;
  }

  const descriptionText = getTranslateText(description);
  return (
    <ShowMore
      showMoreButtonText={localization.showFullDescription}
      label={localization.description}
      contentHtml={descriptionText}
    />
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
    <section className="mb-5 list-type1" name={localization.format}>
      <h3>{localization.format}</h3>
      <hr />
      {formatItems(formats)}
    </section>
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

const renderAccessRights = accessRight => {
  if (!accessRight) {
    return null;
  }

  const { code } = accessRight || {
    code: null
  };
  let accessRightsLabel;

  switch (code) {
    case 'NON_PUBLIC':
      accessRightsLabel = localization.api.accessRight.nonPublic;
      break;
    case 'RESTRICTED':
      accessRightsLabel = localization.api.accessRight.restricted;
      break;
    case 'PUBLIC':
      accessRightsLabel = localization.api.accessRight.public;
      break;
    default:
      accessRightsLabel = localization.api.accessRight.unknown;
  }

  return (
    <React.Fragment>
      <TwoColRow col1={localization.accessLevel} col2={accessRightsLabel} />
      <hr />
    </React.Fragment>
  );
};

const renderAPIInfo = accessRights => {
  if (!accessRights) {
    return null;
  }

  return (
    <ListType1 title={localization.apiInfo}>
      {renderAccessRights(accessRights[0])}
    </ListType1>
  );
};

const renderDatasetReference = (reference, index) => {
  const id = _.get(datasetReference, ['id']);
  const prefLabel = _.get(datasetReference, ['title']);

  return (
    <React.Fragment key={`${index}-${id}`}>
      <div className="mb-4">
        <a
          title={localization.api.linkDatasetReference}
          href={`/datasets/${id}`}
        >
          {prefLabel ? getTranslateText(prefLabel) : id}
        </a>
      </div>
    </React.Fragment>
  );
};

const renderDatasetReferences = references => {
  if (!references) {
    return null;
  }
  const children = items =>
    items.map((item, index) => renderDatasetReference(item, index));

  return (
    <ListType1 title={localization.datasetReferences}>
      {children(references)}
    </ListType1>
  );
};

const renderContactPoint = contactPoint => (
  <React.Fragment key={contactPoint.uri}>
    {contactPoint.organizationName && (
      <React.Fragment>
        <TwoColRow
          col1={localization.contactPoint}
          col2={contactPoint.organizationName}
        />
        <hr />
      </React.Fragment>
    )}
    {contactPoint.email && (
      <React.Fragment>
        <TwoColRow col1={localization.email} col2={contactPoint.email} />
        <hr />
      </React.Fragment>
    )}
    {contactPoint.phone && (
      <React.Fragment>
        <TwoColRow col1={localization.phone} col2={contactPoint.phone} />
      </React.Fragment>
    )}
  </React.Fragment>
);

const renderContactPoints = contactPoints => {
  if (!contactPoints) {
    return null;
  }
  const children = items => items.map(item => renderContactPoint(item));

  return (
    <ListType1 title={localization.contactInfo}>
      {children(contactPoints)}
    </ListType1>
  );
};

const renderStickyMenu = apiItem => {
  const menuItems = [];
  if (_.get(apiItem, 'description')) {
    menuItems.push({
      name: localization.description,
      prefLabel: localization.description
    });
  }
  if (_.get(apiItem, 'formats', []).length > 0) {
    menuItems.push({
      name: localization.format,
      prefLabel: localization.format
    });
  }
  if (_.get(apiItem, ['openApi', 'paths'])) {
    menuItems.push({
      name: localization.api.endpoints.operations,
      prefLabel: localization.api.endpoints.operations
    });
  }
  if (_.get(apiItem, 'accessRights')) {
    menuItems.push({
      name: localization.apiInfo,
      prefLabel: localization.apiInfo
    });
  }
  if (_.get(apiItem, 'datasetReferences')) {
    menuItems.push({
      name: localization.datasetReferences,
      prefLabel: localization.datasetReferences
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

  const { apiItem, publisherItems } = props;

  if (!apiItem) {
    return null;
  }

  const { title } = apiItem || {
    title: null
  };
  const { description } = apiItem || {
    description: null
  };

  const meta = {
    title: getTranslateText(title),
    description: getTranslateText(description)
  };

  return (
    <main id="content" className="container">
      <article>
        <div className="row">
          <div className="col-12 col-lg-8 offset-lg-4">
            <DocumentMeta {...meta} />
            <HarvestDate harvest={apiItem.harvest} />

            <SearchHitHeader
              title={getTranslateText(title)}
              publisherLabel={localization.api.provider}
              publisher={_.get(apiItem, 'publisher')}
              publisherItems={publisherItems}
              provenance={_.get(apiItem, 'provenance')}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-4 ">{renderStickyMenu(apiItem)}</div>

          <section
            className="col-12 col-lg-8 mt-3"
            style={{ marginBottom: '400px' }}
          >
            {renderDescription(description)}

            {renderFormats(_.get(apiItem, 'formats'))}

            {renderApiEndpoints(
              _.get(apiItem, ['openApi', 'paths']),
              _.get(apiItem, 'apiSpecUrl'),
              _.get(apiItem, 'apiDocUrl')
            )}

            {renderAPIInfo(_.get(apiItem, ['accessRights']))}

            {renderDatasetReferences(_.get(apiItem, 'datasetReferences'))}

            {renderContactPoints(_.get(apiItem, 'contactPoint'))}
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
