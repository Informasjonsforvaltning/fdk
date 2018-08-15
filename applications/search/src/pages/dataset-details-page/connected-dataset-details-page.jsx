import { connect } from 'react-redux';
import {
  fetchDatasetDetailsIfNeededAction,
  resetDatasetDetailsAction
} from '../../redux/modules/datasetDetails';
import { fetchDistributionTypeIfNeededAction } from '../../redux/modules/distributionType';
import { ResolvedDatasetDetailsPage } from './resolved-dataset-details-page';

const mapStateToProps = ({ distributionTypes }) => {
  const { distributionTypeItems } = distributionTypes || {
    distributionTypeItems: null
  };

  return {
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
