import { connect } from 'react-redux';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import { fetchThemesIfNeededAction } from '../../redux/modules/themes';
import { ResolvedSearchPage } from './resolved-search-page';
import {
  fetchReferenceDataIfNeededAction,
  REFERENCEDATA_DISTRIBUTIONTYPE
} from '../../redux/modules/referenceData';

const mapStateToProps = ({ themes, publishers, referenceData }) => {
  const { themesItems, isFetchingThemes } = themes || {
    themesItems: null
  };

  const { publisherItems, isFetchingPublishers } = publishers || {
    publisherItems: null
  };

  return {
    themesItems,
    isFetchingThemes,
    publisherItems,
    isFetchingPublishers,
    referenceData
  };
};

const mapDispatchToProps = dispatch => ({
  fetchThemesIfNeeded: () => dispatch(fetchThemesIfNeededAction()),
  fetchPublishersIfNeeded: () => dispatch(fetchPublishersIfNeededAction()),
  fetchReferenceDataIfNeeded: () =>
    dispatch(fetchReferenceDataIfNeededAction(REFERENCEDATA_DISTRIBUTIONTYPE))
});

export const ConnectedSearchPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedSearchPage);
