import { connect } from 'react-redux';
import { fetchDistributionTypeIfNeededAction } from '../../redux/modules/distributionType';
import { fetchReferenceTypesIfNeededAction } from '../../redux/modules/referenceTypes';
import { ResolvedDatasetDetailsPage } from './resolved-dataset-details-page';

const mapStateToProps = ({ distributionTypes, referenceTypes }) => {
  const { distributionTypeItems } = distributionTypes || {
    distributionTypeItems: null
  };

  const { referenceTypeItems } = referenceTypes || {
    referenceTypeItems: null
  };

  return {
    distributionTypeItems,
    referenceTypeItems
  };
};

const mapDispatchToProps = dispatch => ({
  fetchDistributionTypeIfNeeded: () =>
    dispatch(fetchDistributionTypeIfNeededAction()),
  fetchReferenceTypesIfNeeded: () =>
    dispatch(fetchReferenceTypesIfNeededAction())
});

export const ConnectedDatasetDetailsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedDatasetDetailsPage);
