import { connect } from 'react-redux';

import {
  fetchDatasetDetailsIfNeeded,
  resetDatasetDetails
} from '../../redux/actions/index';
import { ApiDetailsPage } from './api-details-page';
import { fakeApiItem } from "./fixtures/fake-api-item";

const mapStateToProps = ({ apiDetails }) => {


  const { apiItem, isFetchingApi } = apiDetails || {
    apiItem: fakeApiItem,
    isFetchingApi: null
  };

  return {
    apiItem,
    isFetchingApi
  };
};

const mapDispatchToProps = dispatch => ({
  fetchDatasetDetailsIfNeeded: url =>
    dispatch(fetchDatasetDetailsIfNeeded(url)),
  resetDatasetDetails: () => dispatch(resetDatasetDetails())
});

export const ConnectedApiDetailsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApiDetailsPage);
