import { connect } from 'react-redux';
import { DatasetDetailsPage } from './dataset-details-page';
import {
  fetchDatasetDetailsIfNeededAction,
  resetDatasetDetailsAction
} from '../../redux/modules/datasetDetails';
import { fetchDistributionTypeIfNeededAction } from '../../redux/modules/distributionType';

const mapStateToProps = ({ datasetDetails, distributionTypes }) => {
  const { datasetItem, isFetchingDataset } = datasetDetails || {
    datasetItem: null,
    isFetchingDataset: null
  };

  const { distributionTypeItems } = distributionTypes || {
    distributionTypeItems: null
  };

  return {
    datasetItem,
    isFetchingDataset,
    distributionTypeItems
  };
};

const mapDispatchToProps = dispatch => ({
  fetchDatasetDetailsIfNeeded: url =>
    dispatch(fetchDatasetDetailsIfNeededAction(url)),
  resetDatasetDetails: () => dispatch(resetDatasetDetailsAction()),
  fetchDistributionTypeIfNeeded: () =>
    dispatch(fetchDistributionTypeIfNeededAction())
});

export const ConnectedDatasetDetailsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetDetailsPage);
