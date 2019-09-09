import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DocumentMeta from 'react-document-meta';

import localization from '../../lib/localization';
import { getTranslateText } from '../../lib/translateText';
import { HarvestDate } from '../../components/harvest-date/harvest-date.component';
import { SearchHitHeader } from '../../components/search-hit-header/search-hit-header.component';
import { StickyMenu } from '../../components/sticky-menu/sticky-menu.component';
import { ListRegular } from '../../components/list-regular/list-regular.component';
import { Tabs } from '../../components/tabs/tabs.component';
import { Structure } from './structure/structure.component';
import './information-model-details-page.scss';

const renderJSONSchema = schema => {
  if (!schema) {
    return null;
  }

  return (
    <div>
      <pre style={{ whiteSpace: 'pre' }}>{JSON.stringify(schema, null, 2)}</pre>
    </div>
  );
};

const createTabsArray = schema => {
  const tabsArray = [];

  // only show structure-tab if schema is an object, not when schema is an array
  if (schema && schema.definitions) {
    tabsArray.push({
      title: localization.infoMod.tabs.structure,
      body: <Structure definitions={schema.definitions} />
    });
  }
  tabsArray.push({
    title: localization.infoMod.tabs.json,
    body: renderJSONSchema(schema)
  });
  return tabsArray;
};

const renderModels = schema => {
  if (!schema) {
    return null;
  }

  return (
    <ListRegular title={localization.infoMod.infoModHeader}>
      <div className="d-flex list-regular--item" />
      <Tabs tabContent={createTabsArray(schema)} />
    </ListRegular>
  );
};

const renderRelatedApi = (referencedApis, publisherItems) => {
  if (!referencedApis || referencedApis.length === 0) {
    return null;
  }
  const apiReferenceItems = items =>
    items.map((item, index) => (
      <div key={`reference-${index}`} className="list-regular--item">
        <SearchHitHeader
          title={item.title}
          titleLink={`/apis/${encodeURIComponent(item.id)}`}
          publisherLabel={`${localization.responsible}:`}
          publisher={item.publisher}
          publisherItems={publisherItems}
          tag="h4"
          darkThemeBackground
        />
      </div>
    ));

  return (
    <ListRegular title={localization.infoMod.relatedAPIHeader}>
      {apiReferenceItems(referencedApis)}
    </ListRegular>
  );
};

const renderStickyMenu = (informationModelItem, referencedApis) => {
  const menuItems = [];

  if (_.get(informationModelItem, 'schema')) {
    menuItems.push({
      name: localization.infoMod.infoModHeader,
      prefLabel: localization.infoMod.infoModHeader
    });
  }
  if (!_.isEmpty(referencedApis)) {
    menuItems.push({
      name: localization.infoMod.relatedAPIHeader,
      prefLabel: localization.infoMod.relatedAPIHeader
    });
  }

  return <StickyMenu title={localization.goTo} menuItems={menuItems} />;
};

function getSchema(model) {
  const schemaJson = _.get(model, 'schema');
  return JSON.parse(schemaJson);
}

export const InformationModelDetailsPage = ({
  fetchPublishersIfNeeded,
  informationModelItem,
  publisherItems,
  referencedApis
}) => {
  fetchPublishersIfNeeded();

  if (!informationModelItem) {
    return null;
  }

  const meta = {
    title: getTranslateText(informationModelItem.title),
    description: getTranslateText(informationModelItem.description)
  };

  return (
    <main id="content" className="container">
      <article>
        <div className="row">
          <div className="col-12 col-lg-9 offset-lg-3">
            <DocumentMeta {...meta} />

            <div className="d-flex align-items-center fdk-detail-date mb-5">
              <i className="align-self-center fdk-icon-catalog-infomodel mr-2" />
              <strong className="align-self-center">
                {localization.infoMod.informationModelDescription}&nbsp;
              </strong>
              <HarvestDate
                className="align-self-center"
                harvest={informationModelItem.harvest}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-3 ">
            {renderStickyMenu(informationModelItem, referencedApis)}
          </div>

          <section className="col-12 col-lg-9 mt-3">
            <SearchHitHeader
              title={getTranslateText(informationModelItem.title)}
              publisherLabel={`${localization.responsible}:`}
              publisher={informationModelItem.publisher}
              publisherItems={publisherItems}
              nationalComponent={informationModelItem.nationalComponent}
              darkThemeBackground
            />

            {renderModels(getSchema(informationModelItem))}

            {renderRelatedApi(referencedApis, publisherItems)}
            <div style={{ height: '75vh' }} />
          </section>
        </div>
      </article>
    </main>
  );
};

InformationModelDetailsPage.defaultProps = {
  informationModelItem: null,
  publisherItems: null,
  fetchPublishersIfNeeded: () => {},
  referencedApis: []
};

InformationModelDetailsPage.propTypes = {
  informationModelItem: PropTypes.object,
  publisherItems: PropTypes.object,
  fetchPublishersIfNeeded: PropTypes.func,
  referencedApis: PropTypes.array
};
