import { connect } from 'react-redux';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import { ResolvedApiDetailsPage } from './resolved-api-details-page';

const mapStateToProps = ({ publishers }) => {
  const { publisherItems } = publishers || {
    publisherItems: null
  };

  return {
    publisherItems
  };
};

const mapDispatchToProps = dispatch => ({
  fetchPublishersIfNeeded: () => dispatch(fetchPublishersIfNeededAction())
});

export const ConnectedApiDetailsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedApiDetailsPage);
