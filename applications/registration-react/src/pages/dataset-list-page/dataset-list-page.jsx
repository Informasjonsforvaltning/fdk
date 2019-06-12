import { batch, connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import _ from 'lodash';

import {
  fetchDatasetsIfNeeded,
  selectorForDatasetsInCatalog
} from '../../redux/modules/datasets';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import { DatasetsListPagePure } from './dataset-list-page-pure';

const mapRouteParams = withProps(({ match: { params } }) =>
  _.pick(params, ['catalogId'])
);

const mapStateToProps = (state, { catalogId }) => {
  const { catalog } = state;
  return {
    catalog,
    datasetItems: Object.values(selectorForDatasetsInCatalog(catalogId)(state))
  };
};

const mapDispatchToProps = dispatch => ({
  dispatchEnsureData: catalogId => {
    batch(() => {
      dispatch(fetchCatalogIfNeeded(catalogId));
      dispatch(fetchDatasetsIfNeeded(catalogId));
    });
  }
});

export const enhance = compose(
  mapRouteParams,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

export const DatasetsListPage = enhance(DatasetsListPagePure);
