import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';

import {
  fetchHelptextsIfNeeded,
  fetchCatalogIfNeeded,
  fetchDatasetsIfNeeded
} from '../../actions/index';
import FormCatalog from '../../components/reg-form-schema-catalog';
import DatasetItemsList from '../../components/reg-dataset-items-list';

class RegDatasetsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    const catalogURL = window.location.pathname.substring(6);
    const datasetsURL = `${catalogURL}/datasets?size=1000&page=0`;
    this.props.dispatch(fetchHelptextsIfNeeded());
    this.props.dispatch(fetchCatalogIfNeeded(catalogURL));
    this.props.dispatch(fetchDatasetsIfNeeded(datasetsURL));
    /*
    this.props.dispatch(fetchReferenceDatasetsIfNeeded(catalogDatasetsURL));
    this.props.dispatch(fetchHelptextsIfNeeded());
    this.props.dispatch(fetchProvenanceIfNeeded());
    this.props.dispatch(fetchFrequencyIfNeeded());
    this.props.dispatch(fetchThemesIfNeeded());
    this.props.dispatch(fetchReferenceTypesIfNeeded());
    this.onIdle = this.onIdle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.refreshSession = this.refreshSession.bind(this);
    */
  }

  _renderDatasets() {
    const { datasetItems } = this.props;
    if (datasetItems && datasetItems._embedded && datasetItems._embedded.datasets) {
      return datasetItems._embedded.datasets.map((item, index) => (
        <div>
          {item.id}
        </div>
      ));
    }
    return null;
  }
  render() {
    const {
      helptextItems,
      isFetchingCatalog,
      catalogItem,
      datasetItems
    } = this.props;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12" />
        </div>
        <div className="row mb-2 mb-md-5">
          <div className="col-md-2" />
          {helptextItems && !isFetchingCatalog && catalogItem && datasetItems &&
          <div className="col-md-8">
            <FormCatalog
              helptextItems={helptextItems}
            />
            <DatasetItemsList
              datasetItems={datasetItems}
            />
          </div>
          }
        </div>
      </div>
    )
  }
}

RegDatasetsList.defaultProps = {

};

RegDatasetsList.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps({ helptexts, catalog, datasets, form }) {
  const { helptextItems } = helptexts || {
    helptextItems: null
  }
  const { catalogItem, isFetchingCatalog } = catalog || {
    catalogItem: null
  }
  const { datasetItems } = datasets || {
    datasetItems: null
  }
  return {
    helptextItems,
    catalogItem,
    isFetchingCatalog,
    datasetItems
  }
}

export default connect(mapStateToProps)(RegDatasetsList);
