import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DocumentMeta from 'react-document-meta';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

import localization from '../../lib/localization';
import { DatasetDescription } from './dataset-description/dataset-description.component';
import { DatasetKeyInfo } from './dataset-key-info/dataset-key-info.component';
import { DatasetDistribution } from './dataset-distribution/dataset-distribution.component';
import { DatasetInfo } from './dataset-info/dataset-info.component';
import { DatasetQuality } from './dataset-quality/dataset-quality.component';
import { getTranslateText } from '../../lib/translateText';
import { ListRegular } from '../../components/list-regular/list-regular.component';
import { HarvestDate } from '../../components/harvest-date/harvest-date.component';
import { TwoColRow } from '../../components/list-regular/twoColRow/twoColRow';
import { BoxRegular } from '../../components/box-regular/box-regular.component';
import { LinkExternal } from '../../components/link-external/link-external.component';
import { DistributionHeading } from './distribution-heading/distribution-heading.component';
import { StickyMenu } from '../../components/sticky-menu/sticky-menu.component';
import {
  REFERENCEDATA_PATH_DISTRIBUTIONTYPE,
  REFERENCEDATA_PATH_LOS,
  REFERENCEDATA_PATH_REFERENCETYPES
} from '../../redux/modules/referenceData';
import { SearchHitHeader } from '../../components/search-hit-header/search-hit-header.component';
import { getFirstLineOfText } from '../../lib/stringUtils';
import './dataset-details-page.scss';
import { getConfig } from '../../config';

const renderPublished = datasetItem => {
  if (!datasetItem) {
    return null;
  }
  return (
    <div className="d-flex flex-wrap mb-5">
      {_.get(datasetItem, 'issued') && (
        <BoxRegular
          title={localization.dataset.issued}
          subText={
            <Moment format="DD.MM.YYYY">{_.get(datasetItem, 'issued')}</Moment>
          }
        />
      )}
      {_.get(datasetItem, 'modified') && (
        <BoxRegular
          title={localization.dataset.modified}
          subText={
            <Moment format="DD.MM.YYYY">
              {_.get(datasetItem, 'modified')}
            </Moment>
          }
        />
      )}
      {_.get(datasetItem, ['accrualPeriodicity', 'prefLabel']) && (
        <BoxRegular
          title={localization.dataset.frequency}
          subText={_.capitalize(
            getTranslateText(
              _.get(datasetItem, ['accrualPeriodicity', 'prefLabel'])
            )
          )}
        />
      )}
    </div>
  );
};
const renderKeyInfo = datasetItem => {
  if (!datasetItem) {
    return null;
  }
  return (
    <DatasetKeyInfo
      accessRights={_.get(datasetItem, 'accessRights')}
      legalBasisForRestriction={_.get(datasetItem, 'legalBasisForRestriction')}
      legalBasisForProcessing={_.get(datasetItem, 'legalBasisForProcessing')}
      legalBasisForAccess={_.get(datasetItem, 'legalBasisForAccess')}
      type={_.get(datasetItem, 'type')}
      conformsTo={_.get(datasetItem, 'conformsTo')}
      informationModel={_.get(datasetItem, 'informationModel')}
      language={_.get(datasetItem, 'language')}
      landingPage={_.get(datasetItem, 'landingPage')}
    />
  );
};

const renderQuality = datasetItem => {
  if (!datasetItem) {
    return null;
  }
  return (
    <DatasetQuality
      relevanceAnnotation={getTranslateText(
        _.get(datasetItem, ['hasRelevanceAnnotation', 'hasBody'])
      )}
      completenessAnnotation={getTranslateText(
        _.get(datasetItem, ['hasCompletenessAnnotation', 'hasBody'])
      )}
      accuracyAnnotation={getTranslateText(
        _.get(datasetItem, ['hasAccuracyAnnotation', 'hasBody'])
      )}
      availabilityAnnotations={getTranslateText(
        _.get(datasetItem, ['hasAvailabilityAnnotation', 'hasBody'])
      )}
      hasCurrentnessAnnotation={getTranslateText(
        _.get(datasetItem, ['hasCurrentnessAnnotation', 'hasBody'])
      )}
      provenance={getTranslateText(
        _.get(datasetItem, ['provenance', 'prefLabel'])
      )}
    />
  );
};

const renderDatasetInfo = (datasetItem, referencedItems, referenceData) => {
  if (!datasetItem) {
    return null;
  }

  return (
    <DatasetInfo
      datasetItem={datasetItem}
      referenceData={referenceData}
      referencedItems={referencedItems}
    />
  );
};

const renderContactPoint = (uri, organizationName, email, phone) => {
  if (!(uri || organizationName || email || phone)) {
    return null;
  }
  return (
    <React.Fragment key={uri || organizationName || email || phone}>
      {uri && (
        <TwoColRow
          col1={localization.contactPoint}
          col2={
            uri ? (
              <LinkExternal uri={uri} prefLabel={organizationName || uri} />
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

const shouldRenderContactPoints = dataset => {
  const contactPoints = _.get(dataset, 'contactPoint');
  return (
    contactPoints && Array.isArray(contactPoints) && contactPoints.length > 0
  );
};

const renderContactPoints = dataset => {
  if (!shouldRenderContactPoints(dataset)) {
    return null;
  }
  const contactPoints = _.get(dataset, 'contactPoint', []);

  return (
    <ListRegular title={localization.contactInfo}>
      {contactPoints.map(item =>
        renderContactPoint(
          _.get(item, 'hasURL'),
          _.get(item, 'organizationUnit'),
          _.get(item, 'email'),
          _.get(item, 'hasTelephone')
        )
      )}
    </ListRegular>
  );
};

const resolveLinkOrExternalLink = item => {
  const datasetPath = `/concepts/${item.uri.substring(
    item.uri.lastIndexOf('/') + 1
  )}`;
  if (getConfig().themeNap) {
    return (
      <LinkExternal
        uri={getConfig().searchHost.host.concat(datasetPath)}
        prefLabel={_.capitalize(getTranslateText(_.get(item, 'prefLabel')))}
      />
    );
  }
  return (
    <Link to={datasetPath}>
      {_.capitalize(getTranslateText(_.get(item, 'prefLabel')))}
    </Link>
  );
};

const renderSubjects = subject => {
  const subjectItems = items =>
    items.map(item => (
      <TwoColRow
        key={item.uri}
        col1={
          item.uri
            ? resolveLinkOrExternalLink(item)
            : _.capitalize(getTranslateText(_.get(item, 'prefLabel')))
        }
        col2={getTranslateText(_.get(item, 'definition'))}
      />
    ));

  if (!subject) {
    return null;
  }

  const sortedSubject = _.sortBy(subject, [
    function sortedSubject(item) {
      return getTranslateText(_.get(item, ['prefLabel']));
    }
  ]);

  return (
    <ListRegular title={localization.dataset.subject}>
      {subjectItems(sortedSubject)}
    </ListRegular>
  );
};

const renderKeywords = keywordItems => {
  const language = localization.getLanguage();
  const keywords = items =>
    items
      .filter(item => !!(item && item[language]))
      .map(item => item[language]);

  if (!keywordItems || keywordItems.length === 0) {
    return null;
  }
  return (
    <ListRegular title={localization.dataset.keyword}>
      <div className="d-flex list-regular--item">
        {keywords(keywordItems).join(', ')}
      </div>
    </ListRegular>
  );
};

const renderDistribution = (
  heading,
  showCount,
  distribution,
  referenceData
) => {
  if (!(distribution && distribution.length > 0)) {
    return null;
  }
  const distributionItems = (distribution, size) =>
    distribution.map((item, index) => (
      <DatasetDistribution
        key={`dist-${index}`}
        description={getTranslateText(item.description)}
        accessUrl={item.accessURL}
        format={item.format}
        license={item.license}
        conformsTo={item.conformsTo}
        page={item.page}
        type={item.type}
        referenceData={referenceData}
        defaultopenCollapse={!!(size === 1)}
      />
    ));

  return (
    <div className="dataset-distributions">
      <DistributionHeading
        title={heading}
        itemsCount={showCount ? distribution.length : undefined}
      />
      {distributionItems(distribution, distribution.length)}
    </div>
  );
};

const renderApis = ({ heading, publisherItems, apis }) => {
  const renderApi = api => (
    <div key={`reference-${api.id}`} className="list-regular--item pt-5">
      <SearchHitHeader
        title={api.title}
        titleLink={`/apis/${encodeURIComponent(api.id)}`}
        publisherLabel={`${localization.provider}:`}
        publisher={api.publisher}
        publisherItems={publisherItems}
        tag="h4"
        darkThemeBackground
        externalLink={!!getConfig().themeNap}
      />
      <div className="uu-invisible" aria-hidden="false">
        Beskrivelse av api
      </div>
      {getFirstLineOfText(getTranslateText(api.description))}
    </div>
  );

  return (
    <div className="dataset-distributions">
      <ListRegular title={heading}>{apis.map(renderApi)}</ListRegular>
    </div>
  );
};

const renderStickyMenu = (datasetItem, apis) => {
  const menuItems = [];

  const distributionsNotTypeAPI = _.get(datasetItem, 'distribution', []).filter(
    item => !item.accessService
  );
  if (_.get(datasetItem, 'description')) {
    menuItems.push({
      name: getTranslateText(_.get(datasetItem, 'title')),
      prefLabel: localization.description
    });
  }
  if (datasetItem) {
    menuItems.push({
      name: localization.dataset.keyInfo,
      prefLabel: localization.dataset.keyInfo
    });
  }
  if (apis.length > 0) {
    menuItems.push({
      name: localization.formatString(
        localization.dataset.distributionsAPI,
        apis.length
      ),
      prefLabel: localization.dataset.distibutionsAPILabel
    });
  }
  if (distributionsNotTypeAPI && distributionsNotTypeAPI.length > 0) {
    menuItems.push({
      name: localization.dataset.distributions,
      prefLabel: localization.dataset.distributions
    });
  }
  if (_.get(datasetItem, 'sample')) {
    menuItems.push({
      name: localization.dataset.sample,
      prefLabel: localization.dataset.sample
    });
  }
  if (
    _.get(datasetItem, 'hasRelevanceAnnotation') ||
    _.get(datasetItem, 'hasCompletenessAnnotation') ||
    _.get(datasetItem, 'hasAccuracyAnnotation') ||
    _.get(datasetItem, 'hasAvailabilityAnnotation') ||
    _.get(datasetItem, 'hasCurrentnessAnnotation') ||
    _.get(datasetItem, 'provenance')
  ) {
    menuItems.push({
      name: localization.dataset.quality,
      prefLabel: localization.dataset.quality
    });
  }
  if (_.get(datasetItem, 'references')) {
    menuItems.push({
      name: localization.dataset.related,
      prefLabel: localization.dataset.related
    });
  }
  if (_.get(datasetItem, 'spatial') || _.get(datasetItem, 'temporal')) {
    menuItems.push({
      name: localization.dataset.restrictions,
      prefLabel: localization.dataset.restrictions
    });
  }
  if (_.get(datasetItem, 'subject')) {
    menuItems.push({
      name: localization.dataset.subject,
      prefLabel: localization.dataset.subject
    });
  }
  if (_.get(datasetItem, 'keyword')) {
    menuItems.push({
      name: localization.dataset.keyword,
      prefLabel: localization.dataset.keyword
    });
  }
  if (shouldRenderContactPoints(datasetItem)) {
    menuItems.push({
      name: localization.contactInfo,
      prefLabel: localization.contactInfo
    });
  }
  return <StickyMenu title={localization.goTo} menuItems={menuItems} />;
};

export const DatasetDetailsPagePure = props => {
  const {
    datasetItem,
    referencedItems,
    referenceData,
    publisherItems,
    apis,
    fetchReferenceDataIfNeeded
  } = props;

  fetchReferenceDataIfNeeded(REFERENCEDATA_PATH_REFERENCETYPES);
  fetchReferenceDataIfNeeded(REFERENCEDATA_PATH_DISTRIBUTIONTYPE);
  fetchReferenceDataIfNeeded(REFERENCEDATA_PATH_LOS);

  if (!datasetItem) {
    return null;
  }

  const meta = {
    title: getTranslateText(_.get(datasetItem, 'title')),
    description: getTranslateText(_.get(datasetItem, 'description'))
  };

  return (
    <main id="content" className="container">
      <article>
        <div className="row">
          <div className="col-12 col-lg-8 offset-lg-4">
            <DocumentMeta {...meta} />

            <div className="d-flex align-items-center fdk-detail-date mb-5 color-neutral-darker">
              <div className="text-center">
                <i className="fdk-icon-catalog-dataset" />
              </div>
              <strong className="align-self-center dataset-description-nowrap">
                {localization.dataset.datasetdescription}&nbsp;
              </strong>
              <HarvestDate
                className="d-flex flex-wrap align-self-center"
                harvest={_.get(datasetItem, 'harvest')}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-4 ">
            {renderStickyMenu(datasetItem, apis)}
          </div>

          <div className="col-12 col-lg-8 mt-3">
            <div name={meta.title}>
              <DatasetDescription
                datasetItem={datasetItem}
                referenceData={referenceData}
              />
              {renderPublished(datasetItem)}
            </div>

            {renderKeyInfo(datasetItem)}

            {apis.length > 0 &&
              renderApis({
                heading: localization.formatString(
                  localization.dataset.distributionsAPI,
                  apis.length
                ),
                publisherItems,
                apis
              })}

            {renderDistribution(
              localization.dataset.distributions,
              true,
              _.get(datasetItem, 'distribution', []).filter(
                item => !item.accessService
              ),
              referenceData
            )}

            {renderDistribution(
              localization.dataset.sample,
              false,
              _.get(datasetItem, 'sample'),
              referenceData
            )}

            {renderQuality(datasetItem)}

            {renderDatasetInfo(datasetItem, referencedItems, referenceData)}

            {renderSubjects(_.get(datasetItem, 'subject'))}

            {renderKeywords(_.get(datasetItem, 'keyword'))}

            {renderContactPoints(datasetItem)}

            <div style={{ height: '75vh' }} />
          </div>
        </div>
      </article>
    </main>
  );
};

DatasetDetailsPagePure.defaultProps = {
  datasetItem: null,
  referencedItems: null,
  referenceData: null,
  fetchReferenceDataIfNeeded: _.noop,
  publisherItems: null,
  apis: []
};

DatasetDetailsPagePure.propTypes = {
  datasetItem: PropTypes.object,
  referencedItems: PropTypes.array,
  referenceData: PropTypes.object,
  fetchReferenceDataIfNeeded: PropTypes.func,
  publisherItems: PropTypes.object,
  apis: PropTypes.array
};
