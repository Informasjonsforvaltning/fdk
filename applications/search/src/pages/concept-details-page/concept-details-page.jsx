import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DocumentMeta from 'react-document-meta';

import localization from '../../lib/localization';
import { getTranslateText } from '../../lib/translateText';
import { ListRegular } from '../../components/list-regular/list-regular.component';
import { TwoColRow } from '../../components/list-regular/twoColRow/twoColRow';
import { HarvestDate } from '../../components/harvest-date/harvest-date.component';
import { SearchHitHeader } from '../../components/search-hit-header/search-hit-header.component';
import { ShowMore } from '../../components/show-more/show-more';
import { LinkExternal } from '../../components/link-external/link-external.component';
import { StickyMenu } from '../../components/sticky-menu/sticky-menu.component';
import './concept-details-page.scss';

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

const renderSource = source => {
  if (!source) {
    return null;
  }
  return (
    <div className="fdk-ingress">
      <span>{localization.compare.source}:&nbsp;</span>
      <span>{getTranslateText(source)}</span>
    </div>
  );
};

const renderRemark = remark => {
  if (!remark) {
    return null;
  }

  return (
    <ListRegular title={localization.concept.remarkHeader}>
      <div className="d-flex list-regular--item">
        {getTranslateText(remark)}
      </div>
    </ListRegular>
  );
};

const renderSubject = subject => {
  if (!subject) {
    return null;
  }
  return (
    <ListRegular title={localization.concept.subjectHeader}>
      <TwoColRow
        col1={localization.concept.subject}
        col2={getTranslateText(subject)}
      />
    </ListRegular>
  );
};

const renderTerms = (altLabel, hiddenLabel) => {
  const labels = labelArray =>
    labelArray.map((item, index) => (
      <span key={`altLabel-${index}`} className="fdk-label-item">
        {getTranslateText(item)}
      </span>
    ));

  const existFieldValue = value =>
    Array.isArray(value) ? value.some(valueItem => !!valueItem) : !!value;

  if (!(existFieldValue(altLabel) || existFieldValue(hiddenLabel))) {
    return false;
  }

  return (
    <ListRegular title={localization.concept.termHeader}>
      {existFieldValue(altLabel) && (
        <TwoColRow
          col1={localization.concept.altLabel}
          col2={labels(altLabel)}
        />
      )}
      {existFieldValue(hiddenLabel) && (
        <TwoColRow
          col1={localization.concept.hiddenLabel}
          col2={labels(hiddenLabel)}
        />
      )}
    </ListRegular>
  );
};

const renderIdentifiers = identifiers => {
  const children = items =>
    items.map(item => (
      <LinkExternal
        uri={_.get(item, 'uri')}
        prefLabel={_.get(item, 'prefLabel') || _.get(item, 'uri')}
      />
    ));

  if (!(identifiers && Array.isArray(identifiers))) {
    return null;
  }

  return (
    <div>
      <span>{localization.compare.source}:&nbsp;</span>
      {children(identifiers)}
    </div>
  );
};

const renderStickyMenu = conceptItem => {
  const menuItems = [];
  console.log(conceptItem);
  if (_.get(conceptItem, 'prefLabel.no')) {
    menuItems.push({
      name: _.get(conceptItem, 'prefLabel.no'),
      prefLabel: localization.facet.concept
    });
  }
  if (_.get(conceptItem, 'publisher.prefLabel.no')) {
    menuItems.push({
      name: _.get(conceptItem, 'publisher.prefLabel.no'),
      prefLabel: localization.description
    });
  }
  return <StickyMenu menuItems={menuItems} />;
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

export const ConceptDetailsPage = props => {
  props.fetchPublishersIfNeeded();

  const { conceptItem, publisherItems } = props;

  if (!conceptItem) {
    return null;
  }

  const meta = {
    title: getTranslateText(_.get(conceptItem, 'prefLabel')),
    description: getTranslateText(_.get(conceptItem, ['definition', 'text']))
  };

  return (
    <main id="content" className="container">
      <article>
        <div className="row2">
          <div className="col-12 col-lg-4 ">{renderStickyMenu(conceptItem)}</div>
          <div className="col-12 col-lg-8 offset-lg-4">
            <DocumentMeta {...meta} />

            <div className="fdk-detail-date mb-5">
              <HarvestDate harvest={_.get(conceptItem, 'harvest')} />

            </div>

            <SearchHitHeader
              title={getTranslateText(_.get(conceptItem, 'prefLabel'))}
              publisherLabel={`${localization.responsible}:`}
              publisher={_.get(conceptItem, 'publisher')}
              publisherItems={publisherItems}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-4 ">
            {renderStickyMenu(conceptItem)}
          </div>
          <section className="col-12 col-lg-8 mt-3">
            {renderDescription(_.get(conceptItem, ['definition', 'text']))}
            {renderSource(_.get(conceptItem, ['definition', 'source']))}
            {renderRemark(_.get(conceptItem, ['definition', 'remark']))}
            {renderSubject(_.get(conceptItem, 'subject'))}
            {renderTerms(
              _.get(conceptItem, 'altLabel'),
              _.get(conceptItem, 'hiddenLabel')
            )}
            {renderIdentifiers(_.get(conceptItem, 'identifiers'))}
            <div style={{ height: '75vh' }} />
          </section>
        </div>
      </article>
    </main>
  );
};

ConceptDetailsPage.defaultProps = {
  conceptItem: null,
  publisherItems: null,
  fetchPublishersIfNeeded: _.noop
};

ConceptDetailsPage.propTypes = {
  conceptItem: PropTypes.object,
  publisherItems: PropTypes.object,
  fetchPublishersIfNeeded: PropTypes.func
};
