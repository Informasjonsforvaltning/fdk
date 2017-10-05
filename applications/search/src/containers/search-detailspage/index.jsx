import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import DatasetDescription from '../../components/search-dataset-description';
import DatasetDistribution from '../../components/search-dataset-distribution';
import DatasetInfo from '../../components/search-dataset-info';
import DatasetQuality from '../../components/search-dataset-quality-content';
import DatasetBegrep from '../../components/search-dataset-begrep';

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
    const url = `/detail?id=${this.props.params.id}`;
    axios.get(url)
      .then((res) => {
        const data = res.data;
        this.setState({
          dataset: data.hits.hits[0]._source,
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
    let distributionNodes;
    const { distribution } = this.state.dataset;
    if (distribution) {
      distributionNodes = distribution.map(distribution => (
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
          authorityCode={this.state.dataset.accessRights ? this.state.dataset.accessRights.authorityCode : null}
          selectedLanguageCode={this.props.selectedLanguageCode}
        />
      ));
    }
    return distributionNodes;
  }

  _renderDatasetInfo() {
    const { accrualPeriodicity } = this.state.dataset;
    if (accrualPeriodicity) {
      return (
        <DatasetInfo
          issued={this.state.dataset.issued}
          accrualPeriodicity={
            accrualPeriodicity.prefLabel[this.props.selectedLanguageCode]
            || accrualPeriodicity.prefLabel.nb
            || accrualPeriodicity.prefLabel.nn
            || accrualPeriodicity.prefLabel.en
          }
          provenance={this.state.dataset.provenance ?
            this.state.dataset.provenance.prefLabel[this.props.selectedLanguageCode]
            || this.state.dataset.provenance.prefLabel.nb
            || this.state.dataset.provenance.prefLabel.nn
            || this.state.dataset.provenance.prefLabel.en
            : '-'
          }
          language={this.state.dataset.language ?
            this.state.dataset.language.prefLabel[this.props.selectedLanguageCode]
            || this.state.dataset.language.prefLabel.nb
            || this.state.dataset.language.prefLabel.nn
            || this.state.dataset.language.prefLabel.en
            : '-'
          }
        />
      );
    }
    return null;
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          {this._renderDatasetDescription()}
          <div className="col-md-8">
            <div className="fdk-container-detail fdk-container-detail-header fdk-margin-top-double">
              <i className="fa fa-unlock fdk-fa-left fdk-color-green" />Datasettet er offentlig
            </div>

            {this._renderDistribution()}

            {this._renderDatasetInfo()}

            <DatasetQuality
              header="Kvalitet på innhold2"
              relevans="tekst følger"
              kompletthet="tekst følger"
              noyaktighet="tekst følger"
              tilgjengelighet="tekst følger"
            />


            <div className="fdk-container-detail fdk-container-detail-header">
              <i className="fa fa-book fdk-fa-left fdk-color-cta" />Begrep
            </div>

            <DatasetBegrep
              title="Jordsmonn"
              description="Dette er Kartverket sin korte og presise definisjon av begrepet Dette er Kartverket sin korte og presise definisjon av begrepet Dette er Kartverket sin korte og presise definisjon av begrepet"
            />
          </div>
        </div>
      </div>
    );
  }
}

DetailsPage.propTypes = {
  id: PropTypes.string,
  params: PropTypes.object,
  selectedLanguageCode: PropTypes.string
};
