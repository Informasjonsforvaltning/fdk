import { connect } from 'react-redux';
import { fetchCatalogsIfNeeded } from '../../redux/modules/catalogs';
import {
  fetchDatasetsIfNeeded,
  selectorForDatasetsState,
  selectorForCatalogDatasetsFromDatasetsState
} from '../../redux/modules/datasets';
import {
  fetchApisIfNeededAction,
  getAPIItemsCount
} from '../../redux/modules/apis';

import { RegCatalogs } from './catalogs-page';

import { getTranslateText } from '../../lib/translateText';

const createPublishers = (catalogItems, datasets, apis) =>
  catalogItems.map(({ id, publisher }) => ({
    id,
    name: getTranslateText(publisher.prefLabel) || publisher.name || '',
    catalogs: [
      {
        type: 'datasets',
        available: !!datasets,
        count: Object.keys(
          selectorForCatalogDatasetsFromDatasetsState(id)(datasets)
        ).length
      },
      {
        type: 'apis',
        available: !!apis,
        count: getAPIItemsCount(apis, id)
      },
      {
        type: 'concepts',
        available: !!localStorage.getItem(
          'FEATURE_TOGGLE_CONCEPT_REGISTRATION'
        ),
        count: null
      }
    ]
  }));

function mapStateToProps(state) {
  const { catalogs, apis } = state;
  const { catalogItems, isFetching } = catalogs || {};
  const datasetsState = selectorForDatasetsState(state);
  const publishers = createPublishers(catalogItems || [], datasetsState, apis);
  return {
    publishers,
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
