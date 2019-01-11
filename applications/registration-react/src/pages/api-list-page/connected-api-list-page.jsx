import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchApisIfNeededAction } from '../../redux/modules/apis';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import { ResolvedAPIListPage } from './resolved-api-list-page';

const mapStateToProps = ({ catalog, apis }, ownProps) => {
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
  return {
    catalogItem,
    registeredApiItems,
    harvestedApiItems
  };
};

const mapDispatchToProps = dispatch => ({
  fetchCatalogIfNeeded: catalogURL =>
    dispatch(fetchCatalogIfNeeded(catalogURL)),
  fetchApisIfNeeded: (catalogId, forceFetch) =>
    dispatch(fetchApisIfNeededAction(catalogId, forceFetch))
});

export const ConnectedAPIListPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedAPIListPage);
