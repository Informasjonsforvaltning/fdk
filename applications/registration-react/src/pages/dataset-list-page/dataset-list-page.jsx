import { connect } from 'react-redux';
import { compose } from 'recompose';
import _ from 'lodash';

import {
  fetchDatasetsIfNeeded,
  selectorForDatasetsInCatalog
} from '../../redux/modules/datasets';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import { DatasetsListPagePure } from './dataset-list-page-pure';

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

export const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

export const DatasetsListPage = enhance(DatasetsListPagePure);
