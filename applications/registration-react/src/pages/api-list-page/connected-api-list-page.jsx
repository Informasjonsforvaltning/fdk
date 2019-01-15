import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchApisIfNeededAction } from '../../redux/modules/apis';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import {
  fetchApiCatalogIfNeededAction,
  postApiCatalogAction
} from '../../redux/modules/apiCatalogs';
import { EnhancedAPIListPage } from './api-list-page';

const mapStateToProps = ({ catalog, apis, apiCatalog }, ownProps) => {
  const catalogId = _.get(ownProps, ['match', 'params', 'catalogId']);
  const catalogItem = _.get(catalog, ['items', catalogId]);
  const registeredApiItems = _.filter(
    _.get(apis, [catalogId, 'items']),
    {
      fromApiCatalog: false
    },
    null
  );
  const harvestedApiItems = _.filter(_.get(apis, [catalogId, 'items']), {
    fromApiCatalog: true
  });

  const apiCatalogs = _.get(apiCatalog, [catalogId, 'item']);

  return {
    catalogItem,
    registeredApiItems,
    harvestedApiItems,
    apiCatalogs
  };
};

const mapDispatchToProps = dispatch => ({
  fetchCatalogIfNeeded: catalogURL =>
    dispatch(fetchCatalogIfNeeded(catalogURL)),
  fetchApisIfNeeded: catalogId => dispatch(fetchApisIfNeededAction(catalogId)),
  fetchApiCatalogIfNeeded: catalogId =>
    dispatch(fetchApiCatalogIfNeededAction(catalogId)),
  postApiCatalogAction: (catalogId, data) =>
    dispatch(postApiCatalogAction(catalogId, data))
});

export const ConnectedAPIListPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(EnhancedAPIListPage);
