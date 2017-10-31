import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import DatasetDescription from '../../components/search-dataset-description';
import DatasetKeyInfo from '../../components/search-dataset-keyinfo';
import DatasetDistribution from '../../components/search-dataset-distribution';
import DatasetInfo from '../../components/search-dataset-info';
import DatasetQuality from '../../components/search-dataset-quality-content';
import DatasetBegrep from '../../components/search-dataset-begrep';
import DatasetContactInfo from '../../components/search-dataset-contactinfo';
import localization from '../../components/localization';
import { getTranslateText } from '../../utils/translateText';
//import api from '../../utils/api.json';

export default class DetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: {}, // api.dataset[0],
      loading: false
    };
    this.loadDatasetFromServer = this.loadDatasetFromServer.bind(this);
  }

  componentDidMount() {
    this.loadDatasetFromServer();
  }

  // @params: the function has no param but the query need dataset id from prop
  // loads all the info for this dataset
  loadDatasetFromServer() {
    const url = `/datasets/${this.props.params.id}`;
    axios.get(url)
      .then((res) => {
        const data = res.data;
        const dataset = data.hits.hits[0]._source;
        this.setState({
          dataset,
          loading: false
        });
      });
  }

  _renderDatasetDescription() {
    const { dataset } = this.state;
    if (dataset) {
      return (
        <DatasetDescription
          title={dataset.title ? getTranslateText(dataset.title, this.props.selectedLanguageCode) : null }
          description={dataset.description ? getTranslateText(dataset.description, this.props.selectedLanguageCode) : null }
          objective={dataset.objective ? getTranslateText(dataset.objective, this.props.selectedLanguageCode) : null }
          publisher={dataset.publisher}
          themes={dataset.theme}
          selectedLanguageCode={this.props.selectedLanguageCode}
        />
      );
    }
    return null;
  }

  _renderDistribution() {
    const { distribution } = this.state.dataset;
    const { accessRights } = this.state.dataset;
    if (!distribution) {
      return null;
    }
    return distribution.map(distribution => (
      <DatasetDistribution
        id={encodeURIComponent(distribution.uri)}
        key={encodeURIComponent(distribution.uri)}
        title={localization.dataset.distribution.title}
        description={distribution.description ? getTranslateText(distribution.description, this.props.selectedLanguageCode) : null }
        accessUrl={distribution.accessURL}
        format={distribution.format}
        code={accessRights ? accessRights.code : null}
        license={distribution.license}
        conformsTo={distribution.conformsTo}
        page={distribution.page}
        selectedLanguageCode={this.props.selectedLanguageCode}
      />
    ));
  }

  _renderSample() {
    const { sample } = this.state.dataset;
    if (!sample) {
      return null;
    }
    return sample.map(sample => (
      <DatasetDistribution
        id={encodeURIComponent(sample.uri)}
        key={encodeURIComponent(sample.uri)}
        title={localization.dataset.sample}
        description={sample.description ? getTranslateText(sample.description, this.props.selectedLanguageCode) : null }
        accessUrl={sample.accessURL}
        format={sample.format}
        code="SAMPLE"
        license={sample.license}
        conformsTo={sample.conformsTo}
        page={sample.page}
        selectedLanguageCode={this.props.selectedLanguageCode}
      />
    ));
  }


  _renderKeyInfo() {
    const { dataset } = this.state;
    if (dataset) {
      return (
        <DatasetKeyInfo
          accessRights={dataset.accessRights}
          legalBasisForRestriction={dataset.legalBasisForRestriction}
          legalBasisForProcessing={dataset.legalBasisForProcessing}
          legalBasisForAccess={dataset.legalBasisForAccess}
          type={dataset.type}
          conformsTo={dataset.conformsTo}
          informationModel={dataset.informationModel}
          selectedLanguageCode={this.props.selectedLanguageCode}
        />
      );
    }
    return null;
  }

  _renderDatasetInfo() {
    const {
      issued,
      accrualPeriodicity,
      provenance,
      hasCurrentnessAnnotation,
      spatial,
      temporal,
      language,
      isPartOf,
      references
    } = this.state.dataset;

    return (
      <DatasetInfo
        issued={issued || null
        }
        accrualPeriodicity={accrualPeriodicity ? getTranslateText(accrualPeriodicity.prefLabel, this.props.selectedLanguageCode) : null }
        provenance={provenance ? getTranslateText(provenance.prefLabel, this.props.selectedLanguageCode) : null }
        hasCurrentnessAnnotation={hasCurrentnessAnnotation ? getTranslateText(hasCurrentnessAnnotation.hasBody, this.props.selectedLanguageCode) : null }
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
    } = this.state.dataset;
    if (hasRelevanceAnnotation || hasCompletenessAnnotation || hasAccuracyAnnotation || hasAvailabilityAnnotation) {
      return (
        <DatasetQuality
          relevanceAnnotation={hasRelevanceAnnotation ? getTranslateText(hasRelevanceAnnotation.hasBody, this.props.selectedLanguageCode) : null }
          completenessAnnotation={hasCompletenessAnnotation ? getTranslateText(hasCompletenessAnnotation.hasBody, this.props.selectedLanguageCode) : null }
          accuracyAnnotation={hasAccuracyAnnotation ? getTranslateText(hasAccuracyAnnotation.hasBody, this.props.selectedLanguageCode) : null }
          availabilityAnnotations={hasAvailabilityAnnotation ? getTranslateText(hasAvailabilityAnnotation.hasBody, this.props.selectedLanguageCode) : null }
        />
      );
    }
    return null;
  }

  _renderContactInfo() {
    const { contactPoint, landingPage } = this.state.dataset;
    if (!contactPoint) {
      return null;
    }
    return contactPoint.map(item => (
      <DatasetContactInfo
        key={item.uri}
        landingPage={landingPage}
        contactPoint={item}
      />
    ));
  }

  _renderBegrep() {
    const { keyword, subject } = this.state.dataset;
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
    const { loading } = this.state;
    if (!loading) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              {this._renderDatasetDescription()}
              {this._renderKeyInfo()}
              {this._renderDistribution()}
              {this._renderSample()}
              {this._renderDatasetInfo()}
              {this._renderQuality()}
              {this._renderBegrep()}
              {this._renderContactInfo()}
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

DetailsPage.defaultProps = {
  params: null,
  selectedLanguageCode: null
};

DetailsPage.propTypes = {
  params: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  selectedLanguageCode: PropTypes.string
};
