import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import DatasetDescription from '../../components/search-dataset-description';
import DatasetDistribution from '../../components/search-dataset-distribution';
import DatasetInfo from '../../components/search-dataset-info';

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
          title={dataset.title}
          description={dataset.description}
          publisher={dataset.publisher}
          themes={dataset.theme}
          selectedLanguageCode={this.props.selectedLanguageCode}
        />
      );
    }
  }

  _renderDistribution() {
    let distributionNodes;
    const {distribution} = this.state.dataset;
    if (distribution) {
      distributionNodes = distribution.map((distribution, index) => (
        <DatasetDistribution
          id={encodeURIComponent(distribution.id)}
          key={encodeURIComponent(distribution.id)}
          title={distribution.title}
          description={distribution.description}
          accessUrl={distribution.accessURL}
          format={distribution.format}
          authorityCode={this.state.dataset.accessRights.authorityCode}
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
            || accrualPeriodicity.prefLabel["nb"]
            || accrualPeriodicity.prefLabel["nn"]
            || accrualPeriodicity.prefLabel["en"]
          }
          provenance={this.state.dataset.provenance}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <div className="container">
        <div className="row">





          <div className="col-md-8">
            <div className="fdk-container-detail fdk-container-detail-header fdk-margin-top-double">
              <i className="fa fa-unlock fdk-fa-left fdk-color-green" />Datasettet er offentlig
            </div>

            {this._renderDistribution()}

            {this._renderDatasetInfo()}


            <div className="fdk-container-detail fdk-container-detail-header">
              <i className="fa fa-star fdk-fa-left fdk-color-cta" />Kvalitet på innhold
            </div>
            <div className="fdk-container-detail">
              <h5>Relevans</h5>
              <p className="fdk-ingress fdk-margin-bottom-double">Denne teksten sier noe om relevansen. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Cum sociis natoque penatibus et magnis dis parturient montes.</p>
              <h5>Kompletthet</h5>
              <p className="fdk-ingress fdk-margin-bottom-double">Denne teksten sier noe om komplettheten. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum.</p>
              <h5>Nøyaktighet</h5>
              <p className="fdk-ingress fdk-margin-bottom-double fdk-margin-bottom-no">Denne teksten sier noe om nøyaktigheten. Cras mattis consectetur purus sit.</p>
              <h5>Tilgjengelighet</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">Denne teksten sier noe om tilgjengeligheten. Vestibulum id ligula porta felis euismod semper. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum.</p>
            </div>

            <div className="fdk-container-detail fdk-container-detail-header">
              <i className="fa fa-book fdk-fa-left fdk-color-cta" />Begrep
            </div>
            <div className="fdk-container-detail fdk-container-detail-begrep">
              <p className="fdk-ingress fdk-margin-bottom-no"><strong>Jordsmonn:</strong> Dette er Kartverket sin korte og presise definisjon av begrepet jo… <i className="fa fa-chevron-down fdk-fa-right fdk-float-right" /></p>
            </div>
            <div className="fdk-container-detail fdk-container-detail-begrep">
              <p className="fdk-ingress fdk-margin-bottom-no"><strong>Jordsmonn:</strong> Dette er Kartverket sin korte og presise definisjon av begrepet jo… <i className="fa fa-chevron-down fdk-fa-right fdk-float-right" /></p>
            </div>
            <div className="fdk-container-detail fdk-container-detail-begrep">
              <p className="fdk-ingress fdk-margin-bottom-no"><strong>Jordsmonn:</strong> Dette er Kartverket sin korte og presise definisjon av begrepet jo… <i className="fa fa-chevron-down fdk-fa-right fdk-float-right" /></p>
            </div>
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
