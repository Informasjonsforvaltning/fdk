import { connect } from 'react-redux';
import { fetchHelptextsIfNeeded } from '../../redux/modules/helptexts';
import { fetchDatasetsIfNeeded } from '../../redux/modules/datasets';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import { DatasetsListPage } from './dataset-list-page';

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
