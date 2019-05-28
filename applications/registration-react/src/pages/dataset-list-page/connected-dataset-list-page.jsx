import { connect } from 'react-redux';
import _ from 'lodash';

import {
  fetchDatasetsIfNeeded,
  getDatasetItemsByCatalogId
} from '../../redux/modules/datasets';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import { DatasetsListPage } from './dataset-list-page';

const mapStateToProps = ({ catalog, datasets }, ownProps) => {
  const catalogId = _.get(ownProps, ['match', 'params', 'catalogId']);
  return {
    catalog,
    datasetItems: getDatasetItemsByCatalogId(datasets, catalogId)
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
