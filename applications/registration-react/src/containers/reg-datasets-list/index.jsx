import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  fetchHelptextsIfNeeded,
  fetchCatalogIfNeeded,
  fetchDatasetsIfNeeded
} from '../../actions/index';
import FormCatalog from '../../components/reg-form-schema-catalog';
import DatasetItemsList from '../../components/reg-dataset-items-list';
import './index.scss';

export class RegDatasetsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const catalogURL = window.location.pathname; // .substring(6);
    const datasetsURL = `${catalogURL}/datasets?size=1000&page=0`;
    this.props.dispatch(fetchHelptextsIfNeeded());
    this.props.dispatch(fetchCatalogIfNeeded(catalogURL));
    this.props.dispatch(fetchDatasetsIfNeeded(datasetsURL));
  }

  render() {
    const {
      helptextItems,
      isFetchingCatalog,
      catalogItem,
      datasetItems
    } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col-12" />
        </div>
        <div className="row mb-2 mb-md-5">
          {helptextItems &&
            !isFetchingCatalog &&
            catalogItem && (
              <div className="col-12 fdk-reg-datasets-list">
                <FormCatalog helptextItems={helptextItems} />
                <DatasetItemsList
                  catalogId={catalogItem.id}
                  datasetItems={datasetItems}
                />
              </div>
            )}
        </div>
      </div>
    );
  }
}

RegDatasetsList.defaultProps = {
  datasetItems: null,
  helptextItems: null,
  isFetchingCatalog: false,
  catalogItem: null
};

RegDatasetsList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  datasetItems: PropTypes.object,
  helptextItems: PropTypes.object,
  isFetchingCatalog: PropTypes.bool,
  catalogItem: PropTypes.object
};

function mapStateToProps({ helptexts, catalog, datasets }) {
  const { helptextItems } = helptexts || {
    helptextItems: null
  };
  const { catalogItem, isFetchingCatalog } = catalog || {
    catalogItem: null
  };
  const { datasetItems } = datasets || {
    datasetItems: null
  };
  return {
    helptextItems,
    catalogItem,
    isFetchingCatalog,
    datasetItems
  };
}

export default connect(mapStateToProps)(RegDatasetsList);
