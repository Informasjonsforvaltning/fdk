import React from 'react';
import PropTypes from 'prop-types';

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

export class DatasetDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.loadDatasetFromServer = this.loadDatasetFromServer.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match) {
      window.scrollTo(0, 0);
      this.loadDatasetFromServer(match);
    }
  }

  componentWillUnmount() {
    this.props.resetDatasetDetails();
  }

  // @params: the function has no param but the query need dataset id from prop
  // loads all the info for this dataset
  loadDatasetFromServer(match) {
    const url = `/datasets/${match.params.id}`;
    this.props.fetchDatasetDetailsIfNeeded(url);
    this.props.fetchDistributionTypeIfNeeded();
  }

  _renderDatasetDescription() {
    const { datasetItem } = this.props;
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

  _renderDistribution() {
    const { distribution, accessRights } = this.props.datasetItem;
    const { openLicenseItems, distributionTypeItems } = this.props;
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

  _renderSample() {
    const { sample } = this.props.datasetItem;
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

  _renderKeyInfo() {
    const { datasetItem } = this.props;
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

  _renderDatasetInfo() {
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
    } = this.props.datasetItem;

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

  _renderQuality() {
    const {
      hasRelevanceAnnotation,
      hasCompletenessAnnotation,
      hasAccuracyAnnotation,
      hasAvailabilityAnnotation
    } = this.props.datasetItem;
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

  _renderLandingPageAndContactInfo() {
    const { contactPoint, landingPage } = this.props.datasetItem;
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
      <section className="fdk-margin-top-triple">
        {landingPage && landingPages(landingPage)}
        {contactPoint && contactPoints(contactPoint)}
      </section>
    );
  }

  _renderBegrep() {
    const { keyword, subject } = this.props.datasetItem;
    if (keyword || subject) {
      return <DatasetBegrep keyword={keyword} subject={subject} />;
    }
    return null;
  }

  render() {
    const { datasetItem } = this.props;
    if (datasetItem) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2" id="content" role="main">
              <article>
                {this._renderDatasetDescription()}
                {this._renderKeyInfo()}
                {this._renderDistribution()}
                {this._renderSample()}
                {this._renderDatasetInfo()}
                {this._renderQuality()}
                {this._renderBegrep()}
                {this._renderLandingPageAndContactInfo()}
              </article>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

DatasetDetailsPage.defaultProps = {
  datasetItem: null,
  distributionTypeItems: null
};

DatasetDetailsPage.propTypes = {
  datasetItem: PropTypes.object,
  distributionTypeItems: PropTypes.array
};
