import React from 'react';
import PropTypes from 'prop-types';

import { ApiDescription } from './api-description/api-description.component';
import { ApiKeyInfo } from './api-key-info/api-key-info.component';
import { ApiEndpoints } from './api-endpoints/api-endpoints.component';
import localization from '../../lib/localization';
import { getTranslateText } from '../../lib/translateText';

export class ApiDetailsPage extends React.Component {
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

  _renderApiDescription() {
    const { apiItem } = this.props;
    const apiItemInfo=apiItem.info
    return (
      <ApiDescription
        title={apiItemInfo.title}
        description={apiItemInfo.description}
        publisher={apiItem.publisher}
        harvest={apiItem.harvest}
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
    console.log('detailsrpor', this.props)

    const { apiItem } = this.props;
    const apiItemInfo=apiItem.info
    return (
      <ApiKeyInfo
        accessRights={apiItemInfo.accessRights}
        // legalBasisForRestriction={apiItem.legalBasisForRestriction}
        // legalBasisForProcessing={apiItem.legalBasisForProcessing}
        // legalBasisForAccess={apiItem.legalBasisForAccess}
        type={apiItemInfo.type}
        format={apiItemInfo.format}
        // conformsTo={apiItem.conformsTo}
        // informationModel={apiItem.informationModel}
        // selectedLanguageCode={this.props.selectedLanguageCode}
      />
    );
  }

  _renderApiEndpoints() {
    return (
      <ApiEndpoints
        paths={this.props.apiItem.paths}
      />
    );
  }

  render() {
    const { apiItem } = this.props;
    console.log('apiite', apiItem);
    if (apiItem) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <article role="main">
                {this._renderApiDescription()}
                {this._renderKeyInfo()}
                 {this._renderApiEndpoints()}
              </article>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

ApiDetailsPage.defaultProps = {
  selectedLanguageCode: null,
  datasetItem: null,
  isFetchingDataset: false
};

ApiDetailsPage.propTypes = {
  selectedLanguageCode: PropTypes.string
};
