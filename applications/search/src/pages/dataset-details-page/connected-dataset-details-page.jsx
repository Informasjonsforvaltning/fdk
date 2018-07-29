import { connect } from 'react-redux';
import { DatasetDetailsPage } from './dataset-details-page';
import {
  fetchDatasetDetailsIfNeededAction,
  resetDatasetDetailsAction
} from '../../redux/modules/datasetDetails';

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
    dispatch(fetchDatasetDetailsIfNeededAction(url)),
  resetDatasetDetails: () => dispatch(resetDatasetDetailsAction())
});

export const ConnectedDatasetDetailsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetDetailsPage);
