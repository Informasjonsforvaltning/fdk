import { connect } from 'react-redux';
import {
  fetchReferenceDataIfNeededAction,
  fetchReferenceDataLosIfNeededAction
} from '../../redux/modules/referenceData';
import { ResolvedDatasetDetailsPage } from './resolved-dataset-details-page';

const mapStateToProps = ({ referenceData, publishers }) => {
  const { publisherItems } = publishers || {
    publisherItems: null
  };
  return {
    referenceData,
    publisherItems
  };
};

const mapDispatchToProps = dispatch => ({
  fetchReferenceDataIfNeeded: code =>
    dispatch(fetchReferenceDataIfNeededAction(code)),
  fetchLosIfNeeded: () => dispatch(fetchReferenceDataLosIfNeededAction())
});

export const ConnectedDatasetDetailsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedDatasetDetailsPage);
