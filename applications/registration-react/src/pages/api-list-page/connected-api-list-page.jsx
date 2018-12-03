import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchApisIfNeededAction } from '../../redux/modules/apis';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import { APIListPage } from './api-list-page';

const mapStateToProps = ({ catalog, apis }, ownProps) => {
  const catalogId = _.get(ownProps, ['match', 'params', 'catalogId']);
  const catalogItem = _.get(catalog, ['items', catalogId]);
  const items = _.get(apis, [catalogId, 'items']);
  return {
    catalogItem,
    items
  };
};

const mapDispatchToProps = dispatch => ({
  fetchCatalogIfNeeded: catalogURL =>
    dispatch(fetchCatalogIfNeeded(catalogURL)),
  fetchApisIfNeeded: catalogId => dispatch(fetchApisIfNeededAction(catalogId))
});

export const ConnectedAPIListPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(APIListPage);
