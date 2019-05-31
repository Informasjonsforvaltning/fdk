import { connect } from 'react-redux';
import { compose } from 'recompose';
import {
  fetchReferenceDataIfNeededAction,
  fetchReferenceDataLosIfNeededAction
} from '../../redux/modules/referenceData';
import { DatasetDetailsPagePure } from "./dataset-details-page-pure";
import { datasetDetailsPageResolver } from "./dataset-details-page-resolver";

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
  fetchReferenceDataIfNeeded: code =>
    dispatch(fetchReferenceDataIfNeededAction(code)),
  fetchLosIfNeeded: () => dispatch(fetchReferenceDataLosIfNeededAction())
});

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  datasetDetailsPageResolver
);

export const DatasetDetailsPage = enhance(DatasetDetailsPagePure);

