import { connect } from 'react-redux';
import { fetchDistributionTypeIfNeededAction } from '../../redux/modules/distributionType';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import { fetchTermsIfNeededAction } from '../../redux/modules/terms';
import { fetchThemesIfNeededAction } from '../../redux/modules/themes';
import { ResolvedSearchPage } from './resolved-search-page';

const mapStateToProps = ({ terms, themes, publishers, distributionTypes }) => {
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
  fetchTermsIfNeeded: url => dispatch(fetchTermsIfNeededAction(url)),
  fetchThemesIfNeeded: () => dispatch(fetchThemesIfNeededAction()),
  fetchPublishersIfNeeded: () => dispatch(fetchPublishersIfNeededAction()),
  fetchDistributionTypeIfNeeded: () =>
    dispatch(fetchDistributionTypeIfNeededAction())
});

export const ConnectedSearchPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedSearchPage);
