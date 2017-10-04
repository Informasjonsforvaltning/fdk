import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import DatasetDescription from '../../components/search-dataset-description';
import DatasetDistribution from '../../components/search-dataset-distribution';

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

  /*
  _renderMainItem() {
    const { mainItem } = this.props;
    const mainItemNodes = '';
    if (mainItem && mainItem.length > 0) {
      return (
        <MainImage
          id={mainItem[0].documentId}
          key={mainItem[0].documentId}
          title={mainItem[0].title}
          lead={mainItem[0].lead}
          imageTitle={mainItem[0].imageTitle}
          image={mainItem[0].image}
          image_320={mainItem[0].image_320}
          image_640={mainItem[0].image_640}
          image_1024={mainItem[0].image_1024}
          image_2000={mainItem[0].image_2000}
          showBackButton={this.props.showBackButton}
        />
      );
    }
    return mainItemNodes;
  }
  */

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

  render() {
    return (
      <div className="container">
        <div className="row">
          {!this.state.loading &&
          <DatasetDescription
            title={this.state.dataset.title}
            description={this.state.dataset.description}
            publisher={this.state.dataset.publisher}
            themes={this.state.dataset.theme}
            selectedLanguageCode={this.props.selectedLanguageCode}
          />
          }




          <div className="col-md-8">
            <div className="fdk-container-detail fdk-container-detail-header fdk-margin-top-double">
              <i className="fa fa-unlock fdk-fa-left fdk-color-green" />Datasettet er offentlig
            </div>

            {this._renderDistribution()}


            <div className="row fdk-row fdk-margin-top-triple">
              <div className="col-md-6 fdk-padding-no">
                <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                    <i className="fa fa-upload fdk-fa-detail" />
                  </div>
                  <div className="fdk-detail-text">
                    <h5>Utgivelsesdato</h5>
                    <p className="fdk-ingress fdk-margin-bottom-no">01.01.2015</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 fdk-padding-no">
                <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                    <i className="fa fa-upload fdk-fa-detail" />
                  </div>
                  <div className="fdk-detail-text">
                    <h5>Opphav</h5>
                    <p className="fdk-ingress fdk-margin-bottom-no">Tredjepart</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 fdk-padding-no">
                <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                    <i className="fa fa-upload fdk-fa-detail" />
                  </div>
                  <div className="fdk-detail-text">
                    <h5>Utgivelsesdato</h5>
                    <p className="fdk-ingress fdk-margin-bottom-no">01.01.2015</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 fdk-padding-no">
                <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                    <i className="fa fa-upload fdk-fa-detail" />
                  </div>
                  <div className="fdk-detail-text">
                    <h5>Opphav</h5>
                    <p className="fdk-ingress fdk-margin-bottom-no">Tredjepart</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 fdk-padding-no">
                <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                    <i className="fa fa-upload fdk-fa-detail" />
                  </div>
                  <div className="fdk-detail-text">
                    <h5>Opphav</h5>
                    <p className="fdk-ingress fdk-margin-bottom-no">Tredjepart</p>
                  </div>
                </div>
              </div>
            </div>

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
