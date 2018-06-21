import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  fetchDatasetDetailsIfNeeded,
  resetDatasetDetails
} from '../../redux/actions/index';
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

export class PureDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: {},
      loading: false
    };
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
  }

  _renderDatasetDescription() {
    const { datasetItem } = this.props;
    return (
      <DatasetDescription
        title={
          datasetItem.title
            ? getTranslateText(
                datasetItem.title,
                this.props.selectedLanguageCode
              )
            : null
        }
        description={
          datasetItem.description
            ? getTranslateText(
                datasetItem.description,
                this.props.selectedLanguageCode
              )
            : null
        }
        descriptionFormatted={
          datasetItem.descriptionFormatted
            ? getTranslateText(
                datasetItem.descriptionFormatted,
                this.props.selectedLanguageCode
              )
            : null
        }
        objective={
          datasetItem.objective
            ? getTranslateText(
                datasetItem.objective,
                this.props.selectedLanguageCode
              )
            : null
        }
        publisher={datasetItem.publisher}
        themes={datasetItem.theme}
        selectedLanguageCode={this.props.selectedLanguageCode}
        harvest={datasetItem.harvest}
        provenance={datasetItem.provenance}
      />
    );
  }

  _renderDistribution() {
    const { distribution, accessRights } = this.props.datasetItem;
    const { openLicenseItems } = this.props;
    if (!distribution) {
      return null;
    }
    return distribution.map(distribution => (
      <DatasetDistribution
        id={encodeURIComponent(distribution.uri)}
        key={encodeURIComponent(distribution.uri)}
        title={localization.dataset.distribution.title}
        description={
          distribution.description
            ? getTranslateText(
                distribution.description,
                this.props.selectedLanguageCode
              )
            : null
        }
        accessUrl={distribution.accessURL}
        format={distribution.format}
        code={accessRights ? accessRights.code : null}
        license={distribution.license}
        conformsTo={distribution.conformsTo}
        page={distribution.page}
        type={distribution.type}
        openLicenseItems={openLicenseItems}
        selectedLanguageCode={this.props.selectedLanguageCode}
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
        id={encodeURIComponent(sample.uri)}
        key={encodeURIComponent(sample.uri)}
        title={localization.dataset.sample}
        description={
          sample.description
            ? getTranslateText(
                sample.description,
                this.props.selectedLanguageCode
              )
            : null
        }
        accessUrl={sample.accessURL}
        format={sample.format}
        code="SAMPLE"
        selectedLanguageCode={this.props.selectedLanguageCode}
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
        selectedLanguageCode={this.props.selectedLanguageCode}
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
        accrualPeriodicity={
          accrualPeriodicity
            ? getTranslateText(
                accrualPeriodicity.prefLabel,
                this.props.selectedLanguageCode
              )
            : null
        }
        modified={modified}
        provenance={
          provenance
            ? getTranslateText(
                provenance.prefLabel,
                this.props.selectedLanguageCode
              )
            : null
        }
        hasCurrentnessAnnotation={
          hasCurrentnessAnnotation
            ? getTranslateText(
                hasCurrentnessAnnotation.hasBody,
                this.props.selectedLanguageCode
              )
            : null
        }
        spatial={spatial}
        temporal={temporal}
        language={language}
        isPartOf={isPartOf}
        references={references}
        selectedLanguageCode={this.props.selectedLanguageCode}
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
          relevanceAnnotation={
            hasRelevanceAnnotation
              ? getTranslateText(
                  hasRelevanceAnnotation.hasBody,
                  this.props.selectedLanguageCode
                )
              : null
          }
          completenessAnnotation={
            hasCompletenessAnnotation
              ? getTranslateText(
                  hasCompletenessAnnotation.hasBody,
                  this.props.selectedLanguageCode
                )
              : null
          }
          accuracyAnnotation={
            hasAccuracyAnnotation
              ? getTranslateText(
                  hasAccuracyAnnotation.hasBody,
                  this.props.selectedLanguageCode
                )
              : null
          }
          availabilityAnnotations={
            hasAvailabilityAnnotation
              ? getTranslateText(
                  hasAvailabilityAnnotation.hasBody,
                  this.props.selectedLanguageCode
                )
              : null
          }
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
      items.map((item, index) => (
        <DatasetLandingPage
          key={`dataset-contactpoint-${item.id}`}
          id={`dataset-contactpoint-${index}`}
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
      return (
        <DatasetBegrep
          keyword={keyword}
          subject={subject}
          selectedLanguageCode={this.props.selectedLanguageCode}
        />
      );
    }
    return null;
  }

  render() {
    const { datasetItem } = this.props;
    if (datasetItem) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2" id="content" role="main">
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

PureDetailsPage.defaultProps = {
  selectedLanguageCode: null,
  datasetItem: null,
  isFetchingDataset: false
};

PureDetailsPage.propTypes = {
  selectedLanguageCode: PropTypes.string
};

const mapStateToProps = ({ datasetDetails }) => {
  const { datasetItem, isFetchingDataset } = datasetDetails || {
    datasetItem: null,
    isFetchingDataset: null
  };

  return {
    datasetItem,
    isFetchingDataset
  };
};

const mapDispatchToProps = dispatch => ({
  fetchDatasetDetailsIfNeeded: url =>
    dispatch(fetchDatasetDetailsIfNeeded(url)),
  resetDatasetDetails: () => dispatch(resetDatasetDetails())
});

export const DetailsPage = connect(mapStateToProps, mapDispatchToProps)(
  PureDetailsPage
);
