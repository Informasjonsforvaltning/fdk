import { connect } from 'react-redux';
import {
  fetchDatasetDetailsIfNeededAction,
  resetDatasetDetailsAction
} from '../../redux/modules/datasetDetails';
import { fetchDistributionTypeIfNeededAction } from '../../redux/modules/distributionType';
import { ResolvedDatasetDetailsPage } from './resolved-dataset-details-page';

const mapStateToProps = ({ datasetDetails, distributionTypes }) => {
  const { isFetchingDataset } = datasetDetails || {
    isFetchingDataset: null
  };

  const { distributionTypeItems } = distributionTypes || {
    distributionTypeItems: null
  };

  return {
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
)(ResolvedDatasetDetailsPage);
