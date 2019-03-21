import { connect } from 'react-redux';
import { fetchCatalogsIfNeededAction } from '../../../redux/modules/catalogs';
import { ReportStats } from './report-stats.component';

const mapStateToProps = ({ catalogs, publishers }) => ({
  catalogs: catalogs && catalogs.items,
  publishers: publishers && publishers.publisherItems
});

const mapDispatchToProps = dispatch => ({
  fetchCatalogsIfNeeded: () => dispatch(fetchCatalogsIfNeededAction())
});

export const ConnectedReportStats = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportStats);
