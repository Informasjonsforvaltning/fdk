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

/*
const mapStateToProps = ({ helptexts, catalog, datasets }) => {
  const { helptextItems } = helptexts || {};
  return {
    helptextItems,
    catalog,
    datasets
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
  */
