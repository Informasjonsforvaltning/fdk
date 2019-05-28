import { connect } from 'react-redux';
import { fetchCatalogsIfNeeded } from '../../redux/modules/catalogs';
import { fetchDatasetsIfNeeded } from '../../redux/modules/datasets';
import { fetchApisIfNeededAction } from '../../redux/modules/apis';
import { RegCatalogs } from './catalogs-page';

function mapStateToProps({ catalogs, datasets, apis }) {
  const { catalogItems, isFetching } = catalogs || {
    catalogItems: null
  };

  return {
    catalogItems,
    datasets,
    apis,
    isFetching
  };
}

const mapDispatchToProps = dispatch => ({
  fetchCatalogsIfNeeded: catalogsURL =>
    dispatch(fetchCatalogsIfNeeded(catalogsURL)),
  fetchDatasetsIfNeeded: catalogId =>
    dispatch(fetchDatasetsIfNeeded(catalogId)),
  fetchApisIfNeeded: catalogId => dispatch(fetchApisIfNeededAction(catalogId))
});

export const ConnectedCatalogsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegCatalogs);
