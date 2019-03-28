import { connect } from 'react-redux';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import { ResolvedApiDetailsPage } from './resolved-api-details-page';
import {
  fetchReferenceDataIfNeededAction,
  REFERENCEDATA_APISTATUS,
  REFERENCEDATA_APISERVICETYPE
} from '../../redux/modules/referenceData';

const mapStateToProps = ({ publishers, referenceData }) => {
  const { publisherItems } = publishers || {
    publisherItems: null
  };

  return {
    publisherItems,
    referenceData
  };
};

const mapDispatchToProps = dispatch => ({
  fetchPublishersIfNeeded: () => dispatch(fetchPublishersIfNeededAction()),
  fetchApiStatusIfNeeded: () =>
    dispatch(fetchReferenceDataIfNeededAction(REFERENCEDATA_APISTATUS)),
  fetchApiServiceTypeIfNeeded: () =>
    dispatch(fetchReferenceDataIfNeededAction(REFERENCEDATA_APISERVICETYPE))
});

export const ConnectedApiDetailsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedApiDetailsPage);
