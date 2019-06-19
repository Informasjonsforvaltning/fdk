import { connect } from 'react-redux';
import { fetchCatalogsIfNeeded } from '../../redux/modules/catalogs';
import {
  fetchDatasetsIfNeeded,
  selectorForDatasetsState
} from '../../redux/modules/datasets';
import { fetchApisIfNeededAction } from '../../redux/modules/apis';
import { RegCatalogs } from './catalogs-page';

function mapStateToProps(state) {
  const { catalogs, apis } = state;
  const { catalogItems, isFetching } = catalogs || {};
  const datasetsState = selectorForDatasetsState(state);
  return {
    catalogItems,
    datasetsState,
    apis,
    isFetching
  };
}

const mapDispatchToProps = dispatch => ({
  fetchCatalogsIfNeeded: () => dispatch(fetchCatalogsIfNeeded()),
  fetchDatasetsIfNeeded: catalogId =>
    dispatch(fetchDatasetsIfNeeded(catalogId)),
  fetchApisIfNeeded: catalogId => dispatch(fetchApisIfNeededAction(catalogId))
});

export const ConnectedCatalogsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegCatalogs);
