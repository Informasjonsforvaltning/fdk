import { connect } from 'react-redux';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import { ResolvedInformationModelDetailsPage } from './resolved-information-model-details-page';

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

export const ConnectedInformationModelDetailsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedInformationModelDetailsPage);
