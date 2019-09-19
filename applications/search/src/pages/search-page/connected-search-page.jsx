import { connect } from 'react-redux';
import { fetchDatasetsIfNeededAction } from '../../redux/modules/datasets';
import { fetchApisIfNeededAction } from '../../redux/modules/apis';
import { fetchConceptsIfNeededAction } from '../../redux/modules/concepts';
import { fetchInformationModelsIfNeededAction } from '../../redux/modules/informationModels';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import {
  addConceptAction,
  removeConceptAction
} from '../../redux/modules/conceptsCompare';
import { SearchPageWithState } from './search-page';
import { fetchReferenceDataIfNeededAction } from '../../redux/modules/referenceData';

const mapStateToProps = ({
  datasets,
  apis,
  concepts,
  informationModels,
  publishers,
  referenceData,
  conceptsCompare,
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

  const { publisherItems, isFetchingPublishers } = publishers || {
    publisherItems: null
  };

  const { items } = conceptsCompare || {
    items: {}
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
    publisherItems,
    isFetchingPublishers,
    referenceData,
    conceptsCompare: items,
    searchQuery
  };
};

const mapDispatchToProps = dispatch => ({
  fetchDatasetsIfNeeded: query => dispatch(fetchDatasetsIfNeededAction(query)),
  fetchApisIfNeeded: query => dispatch(fetchApisIfNeededAction(query)),
  fetchConceptsIfNeeded: query => dispatch(fetchConceptsIfNeededAction(query)),
  fetchPublishersIfNeeded: () => dispatch(fetchPublishersIfNeededAction()),
  fetchReferenceDataIfNeeded: path =>
    dispatch(fetchReferenceDataIfNeededAction(path)),
  addConcept: item => dispatch(addConceptAction(item)),
  removeConcept: uri => dispatch(removeConceptAction(uri)),
  fetchInformationModelsIfNeeded: query =>
    dispatch(fetchInformationModelsIfNeededAction(query))
});

export const ConnectedSearchPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPageWithState);
