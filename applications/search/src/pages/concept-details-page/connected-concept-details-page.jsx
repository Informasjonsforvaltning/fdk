import { connect } from 'react-redux';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import { ResolvedConceptDetailsPage } from './resolved-concept-details-page';

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

export const ConnectedConceptDetailsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedConceptDetailsPage);
