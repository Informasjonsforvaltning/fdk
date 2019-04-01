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
    <ShowMore showMoreButtonText={localization.showFullDescription}>
      {descriptionText}
    </ShowMore>
  );
};

const renderSource = source => {
  if (!source) {
    return null;
  }

  const { uri, prefLabel } = source;

  return (
    <div className="fdk-ingress">
      <span>{localization.compare.source}:&nbsp;</span>
      {uri ? (
        <LinkExternal uri={uri} prefLabel={prefLabel || uri} />
      ) : (
        getTranslateText(prefLabel)
      )}
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

const renderIdentifiers = id => {
  if (!id) {
    return null;
  }

  return (
    <ListRegular title={localization.concept.identifier}>
      <div className="d-flex list-regular--item">
        <a href={`/api/concepts/${id}`}>{`${_.get(
          window.location,
          'origin'
        )}/api/concepts/${id}`}</a>
      </div>
    </ListRegular>
  );
};

const renderContactPoint = contactPoint => {
  if (!(_.get(contactPoint, 'email') || _.get(contactPoint, 'telephone'))) {
    return null;
  }
  return (
    <ListRegular title={localization.contactInfo}>
      {_.get(contactPoint, 'email') && (
        <TwoColRow
          col1={localization.email}
          col2={
            <a
              title={_.get(contactPoint, 'email')}
              href={`mailto:${_.get(contactPoint, 'email')}`}
              rel="noopener noreferrer"
            >
              {_.get(contactPoint, 'email')}
            </a>
          }
        />
      )}
      {_.get(contactPoint, 'telephone') && (
        <TwoColRow
          col1={localization.phone}
          col2={_.get(contactPoint, 'telephone')}
        />
      )}
    </ListRegular>
  );
};

const renderSample = sample => {
  if (!(sample && getTranslateText(sample))) {
    return null;
  }
  return (
    <ListRegular title={localization.concept.sample}>
      <div className="d-flex list-regular--item">
        {getTranslateText(sample)}
      </div>
    </ListRegular>
  );
};

const renderStickyMenu = conceptItem => {
  const menuItems = [];
  menuItems.push({
    name: getTranslateText(_.get(conceptItem, 'prefLabel')),
    prefLabel: localization.concept.definition
  });
  if (getTranslateText(_.get(conceptItem, 'definition.remark'))) {
    menuItems.push({
      name: localization.concept.remarkHeader,
      prefLabel: localization.concept.remarkHeader
    });
  }
  if (getTranslateText(_.get(conceptItem, 'example'))) {
    menuItems.push({
      name: localization.concept.sample,
      prefLabel: localization.concept.sample
    });
  }
  if (getTranslateText(_.get(conceptItem, 'subject'))) {
    menuItems.push({
      name: localization.concept.subjectHeader,
      prefLabel: localization.concept.subjectHeader
    });
  }
  if (
    _.get(conceptItem, 'altLabel[0]') ||
    _.get(conceptItem, 'hiddenLabel[0]')
  ) {
    menuItems.push({
      name: localization.concept.termHeader,
      prefLabel: localization.concept.termHeader
    });
  }

  menuItems.push({
    name: localization.concept.identifier,
    prefLabel: localization.concept.identifier
  });

  if (_.get(conceptItem, 'contactPoint')) {
    menuItems.push({
      name: localization.contactInfo,
      prefLabel: localization.contactInfo
    });
  }

  return <StickyMenu menuItems={menuItems} />;
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
        <div className="row">
          <div className="col-12 col-lg-8  offset-lg-4">
            <DocumentMeta {...meta} />

            <div className="fdk-detail-date mb-5">
              <HarvestDate harvest={_.get(conceptItem, 'harvest')} />
            </div>

            <SearchHitHeader
              title={getTranslateText(_.get(conceptItem, 'prefLabel'))}
              publisherLabel={`${localization.responsible}:`}
              publisher={_.get(conceptItem, 'publisher')}
              publisherTag="span"
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
            {renderSample(_.get(conceptItem, 'example'))}
            {renderSubject(_.get(conceptItem, 'subject'))}
            {renderTerms(
              _.get(conceptItem, 'altLabel'),
              _.get(conceptItem, 'hiddenLabel')
            )}
            {renderIdentifiers(_.get(conceptItem, 'id'))}
            {renderContactPoint(_.get(conceptItem, 'contactPoint'))}
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
