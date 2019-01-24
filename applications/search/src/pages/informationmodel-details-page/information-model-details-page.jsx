import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DocumentMeta from 'react-document-meta';

import localization from '../../lib/localization';
import { getTranslateText } from '../../lib/translateText';
import { HarvestDate } from '../../components/harvest-date/harvest-date.component';
import { SearchHitHeader } from '../../components/search-hit-header/search-hit-header.component';
import { StickyMenu } from '../../components/sticky-menu/sticky-menu.component';
import { ShowMore } from '../../components/show-more/show-more';
import { ListRegular } from '../../components/list-regular/list-regular.component';
import { Tabs } from './tabs/tabs.component';

const renderRelatedApiDescription = description => {
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

const renderModels = schema => {
  if (!schema) {
    return null;
  }

  return (
    <ListRegular title={localization.infoMod.infoModHeader}>
      <div className="d-flex list-regular--item" />
      <Tabs
        tabContent={[
          {
            title: localization.infoMod.tabs.json,
            body: renderJSONSchema(schema)
          }
        ]}
      />
    </ListRegular>
  );
};

const renderRelatedApi = (informationModelItem, publisherItems) => {
  if (!informationModelItem) {
    return null;
  }
  const link = `/apis/${encodeURIComponent(informationModelItem.id)}`;
  return (
    <ListRegular title={localization.infoMod.relatedAPIHeader}>
      <div className="list-regular--item">
        <SearchHitHeader
          title={getTranslateText(informationModelItem.title)}
          titleLink={link}
          publisherLabel={localization.api.provider}
          publisher={informationModelItem.publisher}
          publisherItems={publisherItems}
          tag="h4"
        />
        {renderRelatedApiDescription(informationModelItem.description)}
      </div>
    </ListRegular>
  );
};

const renderStickyMenu = informationModelItem => {
  const menuItems = [];

  if (_.get(informationModelItem, 'schema')) {
    menuItems.push({
      name: localization.infoMod.infoModHeader,
      prefLabel: localization.infoMod.infoModHeader
    });
  }
  if (_.get(informationModelItem, 'id')) {
    menuItems.push({
      name: localization.infoMod.relatedAPIHeader,
      prefLabel: localization.infoMod.relatedAPIHeader
    });
  }

  return <StickyMenu menuItems={menuItems} />;
};

export const InformationModelDetailsPage = props => {
  props.fetchPublishersIfNeeded();

  const { informationModelItem, publisherItems } = props;

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
            <HarvestDate harvest={informationModelItem.harvest} />

            <SearchHitHeader
              title={getTranslateText(informationModelItem.title)}
              publisherLabel={localization.api.provider}
              publisher={informationModelItem.publisher}
              publisherItems={publisherItems}
              nationalComponent={informationModelItem.nationalComponent}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-3 ">
            {renderStickyMenu(informationModelItem)}
          </div>

          <section className="col-12 col-lg-9 mt-3">
            {renderModels(_.get(informationModelItem, 'schema'))}

            {renderRelatedApi(informationModelItem, publisherItems)}
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
  fetchPublishersIfNeeded: () => {}
};

InformationModelDetailsPage.propTypes = {
  informationModelItem: PropTypes.object,
  publisherItems: PropTypes.object,
  fetchPublishersIfNeeded: PropTypes.func
};
