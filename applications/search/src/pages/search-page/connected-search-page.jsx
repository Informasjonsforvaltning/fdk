import { connect } from 'react-redux';
import { fetchDatasetsIfNeededAction } from '../../redux/modules/datasets';
import { fetchApisIfNeededAction } from '../../redux/modules/apis';
import { fetchConceptsIfNeededAction } from '../../redux/modules/concepts';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import { fetchThemesIfNeededAction } from '../../redux/modules/themes';
import {
  setSearchQuery,
  setQueryFilter,
  setQueryFrom,
  clearQuery
} from '../../redux/modules/search';
import {
  setDatasetSortAction,
  setConceptSortAction,
  setApiSortAction,
  setDatasetHitsPerPageAction,
  setConceptHitsPerPageAction,
  setApiHitsPerPageAction
} from '../../redux/modules/settings';
import {
  addConceptAction,
  removeConceptAction
} from '../../redux/modules/conceptsCompare';
import { SearchPageWithState } from './search-page';
import {
  fetchReferenceDataIfNeededAction,
  REFERENCEDATA_DISTRIBUTIONTYPE
} from '../../redux/modules/referenceData';

const mapStateToProps = ({
  datasets,
  apis,
  concepts,
  themes,
  publishers,
  referenceData,
  conceptsCompare,
  settings,
  searchQuery
}) => {
  const { datasetItems, datasetAggregations, datasetTotal } = datasets || {
    datasetItems: null,
    datasetAggregations: null,
    datasetTotal: null
  };

  const { apiItems, apiAggregations, apiTotal } = apis || {
    apiItems: null,
    apiAggregations: null,
    apiTotal: null
  };

  const { conceptItems, conceptAggregations, conceptTotal } = concepts || {
    conceptItems: null,
    conceptAggregations: null,
    conceptTotal: null
  };

  const { themesItems, isFetchingThemes } = themes || {
    themesItems: null
  };

  const { publisherItems, isFetchingPublishers } = publishers || {
    publisherItems: null
  };

  const { items } = conceptsCompare || {
    items: null
  };

  return {
    datasetItems,
    datasetAggregations,
    datasetTotal,
    apiItems,
    apiAggregations,
    apiTotal,
    conceptItems,
    conceptAggregations,
    conceptTotal,
    themesItems,
    isFetchingThemes,
    publisherItems,
    isFetchingPublishers,
    referenceData,
    conceptsCompare: items,
    datasetSortValue: settings.datasetSortValue,
    apiSortValue: settings.apiSortValue,
    conceptSortValue: settings.conceptSortValue,
    datasetHitsPerPageValue: settings.datasetHitsPerPageValue,
    apiHitsPerPageValue: settings.apiHitsPerPageValue,
    conceptHitsPerPageValue: settings.conceptHitsPerPageValue,
    searchQuery
  };
};

const mapDispatchToProps = dispatch => ({
  fetchDatasetsIfNeeded: query => dispatch(fetchDatasetsIfNeededAction(query)),
  fetchApisIfNeeded: query => dispatch(fetchApisIfNeededAction(query)),
  fetchConceptsIfNeeded: query => dispatch(fetchConceptsIfNeededAction(query)),
  fetchThemesIfNeeded: () => dispatch(fetchThemesIfNeededAction()),
  fetchPublishersIfNeeded: () => dispatch(fetchPublishersIfNeededAction()),
  fetchReferenceDataIfNeeded: () =>
    dispatch(fetchReferenceDataIfNeededAction(REFERENCEDATA_DISTRIBUTIONTYPE)),
  addConcept: item => dispatch(addConceptAction(item)),
  removeConcept: uri => dispatch(removeConceptAction(uri)),
  setDatasetSort: sortValue => dispatch(setDatasetSortAction(sortValue)),
  setDatasetHitsPerPage: hitsPerPage =>
    dispatch(setDatasetHitsPerPageAction(hitsPerPage)),
  setApiSort: sortValue => dispatch(setApiSortAction(sortValue)),
  setApiHitsPerPage: hitsPerPage =>
    dispatch(setApiHitsPerPageAction(hitsPerPage)),
  setConceptSort: sortValue => dispatch(setConceptSortAction(sortValue)),
  setConceptHitsPerPage: hitsPerPage =>
    dispatch(setConceptHitsPerPageAction(hitsPerPage)),
  setSearchQuery: (query, history) => dispatch(setSearchQuery(query, history)),
  setQueryFilter: (filterType, filterValue, history) =>
    dispatch(setQueryFilter(filterType, filterValue, history)),
  setQueryFrom: (filterValue, history) =>
    dispatch(setQueryFrom(filterValue, history)),
  clearQuery: history => dispatch(clearQuery(history))
});

export const ConnectedSearchPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPageWithState);
