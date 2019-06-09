import { connect } from 'react-redux';
import _ from 'lodash';

import {
  fetchDatasetsIfNeeded,
  selectorForDatasetsInCatalog
} from '../../redux/modules/datasets';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import { DatasetsListPage } from './dataset-list-page';

const mapStateToProps = (state, ownProps) => {
  const { catalog } = state;
  const catalogId = _.get(ownProps, ['match', 'params', 'catalogId']);
  return {
    catalog,
    datasetItems: Object.values(selectorForDatasetsInCatalog(catalogId)(state))
  };
};

const mapDispatchToProps = dispatch => ({
  fetchCatalogIfNeeded: catalogId => dispatch(fetchCatalogIfNeeded(catalogId)),
  fetchDatasetsIfNeeded: catalogId => dispatch(fetchDatasetsIfNeeded(catalogId))
});

export const ConnectedDatasetsListPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetsListPage);
