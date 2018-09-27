import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  fetchHelptextsIfNeeded,
  fetchCatalogIfNeeded
} from '../../actions/index';
import {
  fetchDatasetsIfNeeded,
  getDatasetItemsByCatalogId
} from '../../redux/modules/datasets';
import FormCatalog from './form-catalog/connected-form-catalog.component';
import DatasetItemsList from './items-list/item-list.component';
import './dataset-list-page.scss';

export class RegDatasetsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const catalogURL = window.location.pathname; // .substring(6);
    const catalogId = catalogURL.split('/').pop();
    this.props.dispatch(fetchHelptextsIfNeeded());
    this.props.dispatch(fetchCatalogIfNeeded(catalogURL));
    this.props.dispatch(fetchDatasetsIfNeeded(catalogId));
  }

  render() {
    const {
      helptextItems,
      isFetchingCatalog,
      catalogItem,
      datasets
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
                  datasetItems={getDatasetItemsByCatalogId(
                    datasets,
                    catalogItem.id
                  )}
                />
              </div>
            )}
        </div>
      </div>
    );
  }
}

RegDatasetsList.defaultProps = {
  datasets: null,
  helptextItems: null,
  isFetchingCatalog: false,
  catalogItem: null
};

RegDatasetsList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  datasets: PropTypes.object,
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
  return {
    helptextItems,
    catalogItem,
    isFetchingCatalog,
    datasets
  };
}

export default connect(mapStateToProps)(RegDatasetsList);
