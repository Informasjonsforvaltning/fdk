import { connect } from 'react-redux';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import { fetchThemesIfNeededAction } from '../../redux/modules/themes';
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
  themes,
  publishers,
  referenceData,
  conceptsCompare,
  settings
}) => {
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
    themesItems,
    isFetchingThemes,
    publisherItems,
    isFetchingPublishers,
    referenceData,
    conceptsCompare: items,
    datasetSortValue: settings.datasetSortValue,
    apiSortValue: settings.apiSortValue,
    conceptSortValue: settings.conceptSortValue
  };
};

const mapDispatchToProps = dispatch => ({
  fetchThemesIfNeeded: () => dispatch(fetchThemesIfNeededAction()),
  fetchPublishersIfNeeded: () => dispatch(fetchPublishersIfNeededAction()),
  fetchReferenceDataIfNeeded: () =>
    dispatch(fetchReferenceDataIfNeededAction(REFERENCEDATA_DISTRIBUTIONTYPE)),
  addConcept: item => dispatch(addConceptAction(item)),
  removeConcept: uri => dispatch(removeConceptAction(uri)),
  setDatasetSort: val => dispatch(setDatasetSortAction(val)),
  setApiSort: val => dispatch(setApiSortAction(val)),
  setConceptSort: val => dispatch(setConceptSortAction(val))
});

export const ConnectedSearchPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedSearchPage);
