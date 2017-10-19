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

export default class DetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: {},
      loading: true
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
    const dataset = this.state.dataset;
    if (dataset.description) {
      return (
        <DatasetDescription
          title={dataset.title ?
            dataset.title[this.props.selectedLanguageCode]
            || dataset.title.nb
            || dataset.title.nn
            || dataset.title.en
            : null
          }
          description={dataset.description ?
            dataset.description[this.props.selectedLanguageCode]
            || dataset.description.nb
            || dataset.description.nn
            || dataset.description.en
            : null
          }
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
    if (!distribution) {
      return null;
    }
    return distribution.map(distribution => (
      <DatasetDistribution
        id={encodeURIComponent(distribution.id)}
        key={encodeURIComponent(distribution.id)}
        description={distribution.description ?
          distribution.description[this.props.selectedLanguageCode]
          || distribution.description.nb
          || distribution.description.nn
          || distribution.description.en
          : null
        }
        accessUrl={distribution.accessURL}
        format={distribution.format}
        code={this.state.dataset.accessRights ? this.state.dataset.accessRights.code : null}
        license={distribution.license}
        page={distribution.page}
        selectedLanguageCode={this.props.selectedLanguageCode}
      />
    ));
  }


  _renderKeyInfo() {
    if (this.state.dataset) {
      return (
        <DatasetKeyInfo
          authorityCode={this.state.dataset.accessRights ? this.state.dataset.accessRights.code : null}
          type={this.state.dataset.type}
          conformsTo={this.state.dataset.conformsTo}
          informationModel={this.state.dataset.informationModel}
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
        accrualPeriodicity={accrualPeriodicity ?
          accrualPeriodicity.prefLabel[this.props.selectedLanguageCode]
            || accrualPeriodicity.prefLabel.nb
          || accrualPeriodicity.prefLabel.no
            || accrualPeriodicity.prefLabel.nn
            || accrualPeriodicity.prefLabel.en
          : null
        }
        provenance={provenance ?
          provenance.prefLabel[this.props.selectedLanguageCode]
            || provenance.prefLabel.nb
            || provenance.prefLabel.nn
            || provenance.prefLabel.en
          : null
        }
        hasCurrentnessAnnotation={hasCurrentnessAnnotation ?
          hasCurrentnessAnnotation.hasBody[this.props.selectedLanguageCode]
            || hasCurrentnessAnnotation.hasBody.nb
            || hasCurrentnessAnnotation.hasBody.nn
            || hasCurrentnessAnnotation.hasBody.no
            || hasCurrentnessAnnotation.hasBody.en
          : null}
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
      hasAvailabilityAnnotations
    } = this.state.dataset;
    if (hasRelevanceAnnotation || hasCompletenessAnnotation || hasAccuracyAnnotation || hasAvailabilityAnnotations) {
      return (
        <DatasetQuality
          relevanceAnnotation={hasRelevanceAnnotation ?
            hasRelevanceAnnotation.hasBody[this.props.selectedLanguageCode]
            || hasRelevanceAnnotation.hasBody.nb
            || hasRelevanceAnnotation.hasBody.no
            || hasRelevanceAnnotation.hasBody.nn
            || hasRelevanceAnnotation.hasBody.en
            : null
          }
          completenessAnnotation={hasCompletenessAnnotation ?
            hasCompletenessAnnotation.hasBody[this.props.selectedLanguageCode]
            || hasCompletenessAnnotation.hasBody.nb
            || hasCompletenessAnnotation.hasBody.no
            || hasCompletenessAnnotation.hasBody.nn
            || hasCompletenessAnnotation.hasBody.en
            : null
          }
          accuracyAnnotation={hasAccuracyAnnotation ?
            hasAccuracyAnnotation.hasBody[this.props.selectedLanguageCode]
            || hasAccuracyAnnotation.hasBody.nb
            || hasAccuracyAnnotation.hasBody.no
            || hasAccuracyAnnotation.hasBody.nn
            || hasAccuracyAnnotation.hasBody.en
            : null
          }
          availabilityAnnotations={hasAvailabilityAnnotations ?
            hasAvailabilityAnnotations.hasBody[this.props.selectedLanguageCode]
            || hasAvailabilityAnnotations.hasBody.nb
            || hasAvailabilityAnnotations.hasBody.no
            || hasAvailabilityAnnotations.hasBody.nn
            || hasAvailabilityAnnotations.hasBody.en
            : null
          }
        />
      );
    }
    return null;
  }

  _renderContactInfo() {
    const { contactPoint } = this.state.dataset;
    if (contactPoint && contactPoint.id) {
      return contactPoint.map(item => (
        <DatasetContactInfo
          key={item.id}
          uri={item.uri}
          email={item.email}
          organizationUnit={item.organizationUnit}
          url={item.hasURL}
          telephone={item.hasTelephone}
        />
      ));
    }
    return null;
  }

  render() {
    const {loading} = this.state;
    if (!loading) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              {this._renderDatasetDescription()}
              {this._renderKeyInfo()}
              {this._renderDistribution()}
              {this._renderDatasetInfo()}
              {this._renderQuality()}
              {this.state.dataset.keyword &&
              <DatasetBegrep
                keyword={this.state.dataset.keyword}
              />
              }
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
