import { connect } from 'react-redux';
import {
  fetchDatasetsIfNeeded,
  fetchTermsIfNeeded,
  fetchThemesIfNeeded,
  fetchPublishersIfNeeded,
  fetchDistributionTypeIfNeeded
} from '../../redux/actions/index';
import { SearchPage } from './search-page';
import { fakeApiItem } from "../api-details-page/fixtures/fake-api-item";

const mapStateToProps = ({
  datasets,
  terms,
  themes,
  publishers,
  distributionTypes
}) => {
  const {
    datasetItems,
    publisherCountItems,
    isFetchingDatasets
  } = datasets || {
    datasetItems: null,
    publisherCountItems: null
  };

  const { termItems, publisherCountTermItems, isFetchingTerms } = terms || {
    termItems: null,
    publisherCountTermItems: null
  };

  const { themesItems, isFetchingThemes } = themes || {
    themesItems: null
  };

  const { publisherItems, isFetchingPublishers } = publishers || {
    publisherItems: null
  };

  const { distributionTypeItems } = distributionTypes || {
    distributionTypeItems: null
  };

  return {
    apiItems: {aggregations:{},hits:{hits:[{_source:fakeApiItem}]}},
    datasetItems,
    publisherCountItems,
    isFetchingDatasets,
    termItems,
    publisherCountTermItems,
    isFetchingTerms,
    themesItems,
    isFetchingThemes,
    publisherItems,
    isFetchingPublishers,
    distributionTypeItems
  };
};

const mapDispatchToProps = dispatch => ({
  fetchDatasetsIfNeeded: url => dispatch(fetchDatasetsIfNeeded(url)),
  fetchTermsIfNeeded: url => dispatch(fetchTermsIfNeeded(url)),
  fetchThemesIfNeeded: () => dispatch(fetchThemesIfNeeded()),
  fetchPublishersIfNeeded: () => dispatch(fetchPublishersIfNeeded()),
  fetchDistributionTypeIfNeeded: () => dispatch(fetchDistributionTypeIfNeeded())
});

export const ConnectedSearchPage = connect(mapStateToProps, mapDispatchToProps)(
  SearchPage
);
