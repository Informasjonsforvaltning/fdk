import { connect } from 'react-redux';
import _ from 'lodash';

import { fetchHelptextsIfNeeded } from '../../redux/modules/helptexts';
import {
  fetchDatasetsIfNeeded,
  getDatasetItemsByCatalogId
} from '../../redux/modules/datasets';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import { DatasetsListPage } from './dataset-list-page';

const mapStateToProps = ({ helptexts, catalog, datasets }, ownProps) => {
  const { helptextItems } = helptexts || {};
  const catalogId = _.get(ownProps, ['match', 'params', 'catalogId']);
  return {
    helptextItems,
    catalog,
    datasetItems: getDatasetItemsByCatalogId(datasets, catalogId)
  };
};

const mapDispatchToProps = dispatch => ({
  fetchHelptextsIfNeeded: () => dispatch(fetchHelptextsIfNeeded()),
  fetchCatalogIfNeeded: catalogId => dispatch(fetchCatalogIfNeeded(catalogId)),
  fetchDatasetsIfNeeded: catalogId => dispatch(fetchDatasetsIfNeeded(catalogId))
});

export const ConnectedDatasetsListPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetsListPage);
