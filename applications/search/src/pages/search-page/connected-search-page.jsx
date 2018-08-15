import { connect } from 'react-redux';
import { fetchDistributionTypeIfNeededAction } from '../../redux/modules/distributionType';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import { fetchThemesIfNeededAction } from '../../redux/modules/themes';
import { ResolvedSearchPage } from './resolved-search-page';

const mapStateToProps = ({ themes, publishers, distributionTypes }) => {
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
    themesItems,
    isFetchingThemes,
    publisherItems,
    isFetchingPublishers,
    distributionTypeItems
  };
};

const mapDispatchToProps = dispatch => ({
  fetchThemesIfNeeded: () => dispatch(fetchThemesIfNeededAction()),
  fetchPublishersIfNeeded: () => dispatch(fetchPublishersIfNeededAction()),
  fetchDistributionTypeIfNeeded: () =>
    dispatch(fetchDistributionTypeIfNeededAction())
});

export const ConnectedSearchPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedSearchPage);
