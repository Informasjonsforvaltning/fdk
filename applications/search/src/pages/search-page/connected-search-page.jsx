import { connect } from 'react-redux';
import { SearchPage } from './search-page';
import { fetchDistributionTypeIfNeededAction } from '../../redux/modules/distributionType';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import { fetchTermsIfNeededAction } from '../../redux/modules/terms';
import { fetchDatasetsIfNeededAction } from '../../redux/modules/datasets';
import { fetchThemesIfNeededAction } from '../../redux/modules/themes';

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
  fetchDatasetsIfNeeded: url => dispatch(fetchDatasetsIfNeededAction(url)),
  fetchTermsIfNeeded: url => dispatch(fetchTermsIfNeededAction(url)),
  fetchThemesIfNeeded: () => dispatch(fetchThemesIfNeededAction()),
  fetchPublishersIfNeeded: () => dispatch(fetchPublishersIfNeededAction()),
  fetchDistributionTypeIfNeeded: () =>
    dispatch(fetchDistributionTypeIfNeededAction())
});

export const ConnectedSearchPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPage);
