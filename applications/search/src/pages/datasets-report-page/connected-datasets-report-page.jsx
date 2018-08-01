import { connect } from 'react-redux';
import { fetchPublishersIfNeededAction } from '../../redux/modules/publishers';
import { DatasetsReportPage } from './datasets-report-page';

const mapStateToProps = ({ publishers }) => ({
  publishers: publishers && publishers.publisherItems
});

const mapDispatchToProps = dispatch => ({
  fetchPublishersIfNeeded: () => dispatch(fetchPublishersIfNeededAction())
});

export const ConnectedDatasetsReportPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetsReportPage);
