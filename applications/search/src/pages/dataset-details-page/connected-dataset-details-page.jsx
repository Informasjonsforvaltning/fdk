import { connect } from 'react-redux';

import {
  fetchDatasetDetailsIfNeeded,
  resetDatasetDetails
} from '../../redux/actions/index';
import { DatasetDetailsPage } from './dataset-details-page';

const mapStateToProps = ({ datasetDetails }) => {
  const { datasetItem, isFetchingDataset } = datasetDetails || {
    datasetItem: null,
    isFetchingDataset: null
  };

  return {
    datasetItem,
    isFetchingDataset
  };
};

const mapDispatchToProps = dispatch => ({
  fetchDatasetDetailsIfNeeded: url =>
    dispatch(fetchDatasetDetailsIfNeeded(url)),
  resetDatasetDetails: () => dispatch(resetDatasetDetails())
});

export const ConnectedDatasetDetailsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetDetailsPage);
