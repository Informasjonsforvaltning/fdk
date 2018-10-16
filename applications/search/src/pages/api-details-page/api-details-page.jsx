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
import { ListRegular } from '../../components/list-regular/list-regular.component';
import { TwoColRow } from '../../components/list-regular/twoColRow/twoColRow';

const renderDescription = description => {
  if (!description) {
    return null;
  }

  const descriptionText = getTranslateText(description);
  return (
    <ShowMore
      showMoreButtonText={localization.showFullDescription}
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
  return (
    <ListRegular title={localization.apiInfo}>
      {children}
    </ListRegular>
  );
};

const renderDatasetReference = (datasetReference, index) => {
  const id = _.get(datasetReference, ['id']);
  const prefLabel = _.get(datasetReference, ['title']);

  return (
    <React.Fragment key={`${index}-${id}`}>
      <div className="d-flex list-regular--item mb-4">
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
    <ListRegular title={localization.datasetReferences}>
      {children(references)}
    </ListRegular>
  );
};

const renderContactPoint = contactPoint => {
  const { uri, organizationName, email, phone } = contactPoint;
  return (
    <React.Fragment key={uri || organizationName}>
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
  if (!contactPoints) {
    return null;
  }
  const children = items => items.map(item => renderContactPoint(item));

  return (
    <ListRegular title={localization.contactInfo}>
      {children(contactPoints)}
    </ListRegular>
  );
};

const renderStickyMenu = apiItem => {
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
              nationalComponent={_.get(apiItem, 'nationalComponent')}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-4 ">{renderStickyMenu(apiItem)}</div>

          <section className="col-12 col-lg-8 mt-3">
            {renderDescription(description)}

            {renderFormats(_.get(apiItem, 'formats'))}

            {renderApiEndpoints(
              _.get(apiItem, ['openApi', 'paths']),
              _.get(apiItem, 'apiSpecUrl'),
              _.get(apiItem, 'apiDocUrl')
            )}

            {renderAPIInfo({})}

            {renderDatasetReferences(_.get(apiItem, 'datasetReferences'))}

            {renderContactPoints(_.get(apiItem, 'contactPoint'))}

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
  fetchPublishersIfNeeded: () => {
  }
};

ApiDetailsPage.propTypes = {
  apiItem: PropTypes.object,
  publisherItems: PropTypes.object,
  fetchPublishersIfNeeded: PropTypes.func
};
