import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DocumentMeta from 'react-document-meta';

import { DatasetDescription } from './dataset-description/dataset-description.component';
import { DatasetKeyInfo } from './dataset-key-info/dataset-key-info.component';
import { DatasetDistribution } from './dataset-distribution/dataset-distribution.component';
import { DatasetInfo } from './dataset-info/dataset-info.component';
import { DatasetQuality } from './dataset-quality/dataset-quality.component';
import { DatasetBegrep } from './dataset-begrep/dataset-begrep.component';
import { DatasetLandingPage } from './dataset-landing-page/dataset-landing-page.component';
import { DatasetContactInfo } from './dataset-contact-info/dataset-contact-info.component';
import localization from '../../lib/localization';
import { getTranslateText } from '../../lib/translateText';

export function DatasetDetailsPage(props) {
  function _renderDatasetDescription() {
    const { datasetItem } = props;
    return (
      <DatasetDescription
        title={getTranslateText(datasetItem.title)}
        description={getTranslateText(datasetItem.description)}
        descriptionFormatted={getTranslateText(
          datasetItem.descriptionFormatted
        )}
        objective={getTranslateText(datasetItem.objective)}
        publisher={datasetItem.publisher}
        themes={datasetItem.theme}
        harvest={datasetItem.harvest}
        provenance={datasetItem.provenance}
      />
    );
  }

  function _renderDistribution() {
    const { distribution, accessRights } = props.datasetItem;
    const { openLicenseItems, distributionTypeItems } = props;
    if (!distribution) {
      return null;
    }
    return distribution.map(distribution => (
      <DatasetDistribution
        key={encodeURIComponent(distribution.uri)}
        title={localization.dataset.distribution.title}
        description={getTranslateText(distribution.description)}
        accessUrl={distribution.accessURL}
        format={distribution.format}
        code={accessRights ? accessRights.code : null}
        license={distribution.license}
        conformsTo={distribution.conformsTo}
        page={distribution.page}
        type={distribution.type}
        openLicenseItems={openLicenseItems}
        distributionTypeItems={distributionTypeItems}
      />
    ));
  }

  function _renderSample() {
    const { sample } = props.datasetItem;
    if (!sample) {
      return null;
    }
    return sample.map(sample => (
      <DatasetDistribution
        key={encodeURIComponent(sample.uri)}
        title={localization.dataset.sample}
        description={getTranslateText(sample.description)}
        accessUrl={sample.accessURL}
        format={sample.format}
        code="SAMPLE"
      />
    ));
  }

  function _renderKeyInfo() {
    const { datasetItem } = props;
    return (
      <DatasetKeyInfo
        accessRights={datasetItem.accessRights}
        legalBasisForRestriction={datasetItem.legalBasisForRestriction}
        legalBasisForProcessing={datasetItem.legalBasisForProcessing}
        legalBasisForAccess={datasetItem.legalBasisForAccess}
        type={datasetItem.type}
        conformsTo={datasetItem.conformsTo}
        informationModel={datasetItem.informationModel}
      />
    );
  }

  function _renderDatasetInfo() {
    const {
      issued,
      accrualPeriodicity,
      modified,
      provenance,
      hasCurrentnessAnnotation,
      spatial,
      temporal,
      language,
      isPartOf,
      references
    } = props.datasetItem;

    return (
      <DatasetInfo
        issued={issued || null}
        accrualPeriodicity={getTranslateText(
          accrualPeriodicity && accrualPeriodicity.prefLabel
        )}
        modified={modified}
        provenance={getTranslateText(provenance && provenance.prefLabel)}
        hasCurrentnessAnnotation={getTranslateText(
          hasCurrentnessAnnotation && hasCurrentnessAnnotation.hasBody
        )}
        spatial={spatial}
        temporal={temporal}
        language={language}
        isPartOf={isPartOf}
        references={references}
      />
    );
  }

  function _renderQuality() {
    const {
      hasRelevanceAnnotation,
      hasCompletenessAnnotation,
      hasAccuracyAnnotation,
      hasAvailabilityAnnotation
    } = props.datasetItem;
    if (
      hasRelevanceAnnotation ||
      hasCompletenessAnnotation ||
      hasAccuracyAnnotation ||
      hasAvailabilityAnnotation
    ) {
      return (
        <DatasetQuality
          relevanceAnnotation={getTranslateText(
            hasRelevanceAnnotation && hasRelevanceAnnotation.hasBody
          )}
          completenessAnnotation={getTranslateText(
            hasCompletenessAnnotation && hasCompletenessAnnotation.hasBody
          )}
          accuracyAnnotation={getTranslateText(
            hasAccuracyAnnotation && hasAccuracyAnnotation.hasBody
          )}
          availabilityAnnotations={getTranslateText(
            hasAvailabilityAnnotation && hasAvailabilityAnnotation.hasBody
          )}
        />
      );
    }
    return null;
  }

  function _renderLandingPageAndContactInfo() {
    const { contactPoint, landingPage } = props.datasetItem;
    if (!(contactPoint || landingPage)) {
      return null;
    }
    const contactPoints = items =>
      items.map((item, index) => (
        <DatasetContactInfo
          key={index}
          landingPage={landingPage}
          contactPoint={item}
        />
      ));

    const landingPages = items =>
      items.map(item => (
        <DatasetLandingPage
          key={`dataset-contactpoint-${item.id}`}
          landingPage={item}
        />
      ));

    return (
      <section className="mt-5">
        {landingPage && landingPages(landingPage)}
        {contactPoint && contactPoints(contactPoint)}
      </section>
    );
  }

  function _renderBegrep() {
    const { keyword, subject } = props.datasetItem;
    if (keyword || subject) {
      return <DatasetBegrep keyword={keyword} subject={subject} />;
    }
    return null;
  }

  props.fetchDistributionTypeIfNeeded();

  const { datasetItem } = props;
  if (!datasetItem) {
    return null;
  }

  const meta = {
    title: getTranslateText(_.get(datasetItem, 'title')),
    description: getTranslateText(_.get(datasetItem, 'description'))
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8 offset-lg-2" id="content" role="main">
          <article>
            <DocumentMeta {...meta} />
            {_renderDatasetDescription()}
            {_renderKeyInfo()}
            {_renderDistribution()}
            {_renderSample()}
            {_renderDatasetInfo()}
            {_renderQuality()}
            {_renderBegrep()}
            {_renderLandingPageAndContactInfo()}
          </article>
        </div>
      </div>
    </div>
  );
}

DatasetDetailsPage.defaultProps = {
  datasetItem: null,
  distributionTypeItems: null,
  fetchDistributionTypeIfNeeded: () => {}
};

DatasetDetailsPage.propTypes = {
  datasetItem: PropTypes.object,
  distributionTypeItems: PropTypes.array,
  fetchDistributionTypeIfNeeded: PropTypes.func
};
