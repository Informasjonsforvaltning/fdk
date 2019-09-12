import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fetchReferenceDataIfNeededAction } from '../../redux/modules/referenceData';
import { DatasetDetailsPagePure } from './dataset-details-page-pure';
import { datasetDetailsPageResolver } from './dataset-details-page-resolver';

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
  fetchReferenceDataIfNeeded: path =>
    dispatch(fetchReferenceDataIfNeededAction(path))
});

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  datasetDetailsPageResolver
);

export const DatasetDetailsPage = enhance(DatasetDetailsPagePure);
