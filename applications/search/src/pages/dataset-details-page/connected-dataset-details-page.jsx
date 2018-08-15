import { connect } from 'react-redux';
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
  fetchDistributionTypeIfNeeded: () =>
    dispatch(fetchDistributionTypeIfNeededAction())
});

export const ConnectedDatasetDetailsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedDatasetDetailsPage);
