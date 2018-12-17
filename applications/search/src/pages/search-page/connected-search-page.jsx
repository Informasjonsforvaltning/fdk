import { connect } from 'react-redux';
import { fetchDatasetsIfNeededAction } from '../../redux/modules/datasets';
import { fetchApisIfNeededAction } from '../../redux/modules/apis';
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
  setApiSortAction
} from '../../redux/modules/settings';
import {
  addConceptAction,
  removeConceptAction
} from '../../redux/modules/conceptsCompare';
import { ResolvedSearchPage } from './resolved-search-page';
import {
  fetchReferenceDataIfNeededAction,
  REFERENCEDATA_DISTRIBUTIONTYPE
} from '../../redux/modules/referenceData';

const mapStateToProps = ({
  datasets,
  apis,
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

  const { apiItems, apiTotal, apiAggregations } = apis || {
    apiItems: null,
    apiTotal: 0,
    apiAggregations: null
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
    datasetTotal,
    datasetItems,
    datasetAggregations,
    apiItems,
    apiTotal,
    apiAggregations,
    themesItems,
    isFetchingThemes,
    publisherItems,
    isFetchingPublishers,
    referenceData,
    conceptsCompare: items,
    datasetSortValue: settings.datasetSortValue,
    apiSortValue: settings.apiSortValue,
    conceptSortValue: settings.conceptSortValue,
    searchQuery
  };
};

const mapDispatchToProps = dispatch => ({
  fetchDatasetsIfNeeded: query => dispatch(fetchDatasetsIfNeededAction(query)),
  fetchApisIfNeeded: query => dispatch(fetchApisIfNeededAction(query)),
  fetchThemesIfNeeded: () => dispatch(fetchThemesIfNeededAction()),
  fetchPublishersIfNeeded: () => dispatch(fetchPublishersIfNeededAction()),
  fetchReferenceDataIfNeeded: () =>
    dispatch(fetchReferenceDataIfNeededAction(REFERENCEDATA_DISTRIBUTIONTYPE)),
  addConcept: item => dispatch(addConceptAction(item)),
  removeConcept: uri => dispatch(removeConceptAction(uri)),
  setDatasetSort: sortValue => dispatch(setDatasetSortAction(sortValue)),
  setApiSort: sortValue => dispatch(setApiSortAction(sortValue)),
  setConceptSort: sortValue => dispatch(setConceptSortAction(sortValue)),
  setSearchQuery: query => dispatch(setSearchQuery(query)),
  setQueryFilter: (filterType, filterValue, history) =>
    dispatch(setQueryFilter(filterType, filterValue, history)),
  setQueryFrom: (filterValue, history) =>
    dispatch(setQueryFrom(filterValue, history)),
  clearQuery: history => dispatch(clearQuery(history))
});

export const ConnectedSearchPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedSearchPage);
