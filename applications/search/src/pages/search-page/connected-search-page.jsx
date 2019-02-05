import { connect } from 'react-redux';
import { fetchDatasetsIfNeededAction } from '../../redux/modules/datasets';
import { fetchApisIfNeededAction } from '../../redux/modules/apis';
import { fetchConceptsIfNeededAction } from '../../redux/modules/concepts';
import { fetchInformationModelsIfNeededAction } from '../../redux/modules/informationModels';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import { fetchThemesIfNeededAction } from '../../redux/modules/themes';
import {
  setConceptSortAction,
  setInformationModelSortAction
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
  informationModels,
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

  const {
    informationModelItems,
    informationModelAggregations,
    informationModelTotal
  } = informationModels || {
    informationModelItems: null,
    informationModelAggregations: null,
    informationModelTotal: null
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
    informationModelItems,
    informationModelAggregations,
    informationModelTotal,
    themesItems,
    isFetchingThemes,
    publisherItems,
    isFetchingPublishers,
    referenceData,
    conceptsCompare: items,
    conceptSortValue: settings.conceptSortValue,
    informationModelSortValue: settings.informationModelSortValue,
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
  setConceptSort: sortValue => dispatch(setConceptSortAction(sortValue)),
  fetchInformationModelsIfNeeded: query =>
    dispatch(fetchInformationModelsIfNeededAction(query)),
  setInformationModelSort: sortValue =>
    dispatch(setInformationModelSortAction(sortValue))
});

export const ConnectedSearchPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPageWithState);
