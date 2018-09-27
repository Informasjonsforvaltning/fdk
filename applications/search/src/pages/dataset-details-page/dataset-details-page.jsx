import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DocumentMeta from 'react-document-meta';
import Moment from 'react-moment';

import localization from '../../lib/localization';
import { DatasetDescription } from './dataset-description/dataset-description.component';
import { DatasetKeyInfo } from './dataset-key-info/dataset-key-info.component';
import { DatasetDistribution } from './dataset-distribution/dataset-distribution.component';
import { DatasetInfo } from './dataset-info/dataset-info.component';
import { DatasetQuality } from './dataset-quality/dataset-quality.component';
import { getTranslateText } from '../../lib/translateText';
import { ListRegular } from '../../components/list-regular/list-regular.component';
import { TwoColRow } from '../../components/list-regular/twoColRow/twoColRow';
import { BoxRegular } from '../../components/box-regular/box-regular.component';
import { LinkExternal } from '../../components/link-external/link-external.component';
import { DistributionHeading } from './distribution-heading/distribution-heading.component';
import { StickyMenu } from '../../components/sticky-menu/sticky-menu.component';

const renderPublished = datasetItem => {
  if (!datasetItem) {
    return null;
  }
  return (
    <div className="d-flex flex-wrap mb-5">
      <BoxRegular
        title={localization.dataset.issued}
        subText={
          <Moment format="DD.MM.YYYY">{_.get(datasetItem, 'issued')}</Moment>
        }
      />
      <BoxRegular
        title={localization.dataset.modified}
        subText={
          <Moment format="DD.MM.YYYY">{_.get(datasetItem, 'modified')}</Moment>
        }
      />
      <BoxRegular
        title={localization.dataset.frequency}
        subText={_.capitalize(
          getTranslateText(
            _.get(datasetItem, ['accrualPeriodicity', 'prefLabel'])
          )
        )}
      />
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

const renderDatasetInfo = (
  datasetItem,
  referencedItems,
  referenceTypeItems
) => {
  if (!datasetItem) {
    return null;
  }

  return (
    <DatasetInfo
      datasetItem={datasetItem}
      referenceTypeItems={referenceTypeItems}
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

const renderContactPoints = contactPoint => {
  if (
    !contactPoint ||
    !Array.isArray(contactPoint) ||
    contactPoint.length === 0
  ) {
    return null;
  }

  return (
    <ListRegular title={localization.contactInfo}>
      {contactPoint.map(item =>
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

const renderSubjects = subject => {
  const subjectItems = items =>
    items.map(item => (
      <TwoColRow
        key={item.uri}
        col1={getTranslateText(_.get(item, 'prefLabel'))}
        col2={getTranslateText(_.get(item, 'definition'))}
      />
    ));

  if (!subject) {
    return null;
  }
  return (
    <ListRegular title={localization.dataset.subject}>
      {subjectItems(subject)}
    </ListRegular>
  );
};

const renderKeywords = keyword => {
  const keywordItems = items =>
    items.map((item, index) => (
      <span key={index}>
        {index > 0 ? ', ' : ''}
        {getTranslateText(item)}
      </span>
    ));

  if (!keyword || keyword.length === 0) {
    return null;
  }
  return (
    <ListRegular title={localization.dataset.keyword}>
      <div className="row list-regular--item">{keywordItems(keyword)}</div>
    </ListRegular>
  );
};

const renderDistribution = (
  heading,
  distribution,
  openLicenseItems,
  distributionTypeItems
) => {
  if (!distribution) {
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
        openLicenseItems={openLicenseItems}
        distributionTypeItems={distributionTypeItems}
        defaultopenCollapse={!!(size === 1)}
      />
    ));

  return (
    <div className="dataset-distributions">
      <DistributionHeading title={heading} />
      {distributionItems(distribution, distribution.length)}
    </div>
  );
};

const renderStickyMenu = datasetItem => {
  const menuItems = [];
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
  if (_.get(datasetItem, 'distribution')) {
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
  if (_.get(datasetItem, 'contactPoint')) {
    menuItems.push({
      name: localization.contactInfo,
      prefLabel: localization.contactInfo
    });
  }
  return <StickyMenu menuItems={menuItems} />;
};

export const DatasetDetailsPage = props => {
  props.fetchDistributionTypeIfNeeded();
  props.fetchReferenceTypesIfNeeded();

  const {
    datasetItem,
    referencedItems,
    referenceTypeItems,
    openLicenseItems,
    distributionTypeItems
  } = props;

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
          <div className="col-12 col-lg-4 ">
            {renderStickyMenu(datasetItem)}
          </div>

          <div className="col-12 col-lg-8">
            <DocumentMeta {...meta} />

            <DatasetDescription datasetItem={datasetItem} />

            {renderPublished(datasetItem)}

            {renderKeyInfo(datasetItem)}

            {renderDistribution(
              localization.dataset.distributions,
              _.get(datasetItem, 'distribution'),
              openLicenseItems,
              distributionTypeItems
            )}

            {renderDistribution(
              localization.dataset.sample,
              _.get(datasetItem, 'sample'),
              openLicenseItems,
              distributionTypeItems
            )}

            {renderQuality(datasetItem)}

            {renderDatasetInfo(
              datasetItem,
              referencedItems,
              referenceTypeItems
            )}

            {renderSubjects(_.get(datasetItem, 'subject'))}

            {renderKeywords(_.get(datasetItem, 'keyword'))}

            {renderContactPoints(_.get(datasetItem, 'contactPoint'))}

            <div style={{ height: '75vh' }} />
          </div>
        </div>
      </article>
    </main>
  );
};

DatasetDetailsPage.defaultProps = {
  datasetItem: null,
  referencedItems: null,
  distributionTypeItems: null,
  referenceTypeItems: null,
  fetchDistributionTypeIfNeeded: () => {},
  fetchReferenceTypesIfNeeded: () => {}
};

DatasetDetailsPage.propTypes = {
  datasetItem: PropTypes.object,
  referencedItems: PropTypes.array,
  distributionTypeItems: PropTypes.array,
  referenceTypeItems: PropTypes.array,
  fetchDistributionTypeIfNeeded: PropTypes.func,
  fetchReferenceTypesIfNeeded: PropTypes.func
};
