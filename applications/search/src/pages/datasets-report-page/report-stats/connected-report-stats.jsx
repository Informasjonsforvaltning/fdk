import { connect } from 'react-redux';
import { fetchCatalogsIfNeededAction } from '../../../redux/modules/catalogs';
import { ReportStats } from './report-stats.component';

const mapStateToProps = ({ catalogs }) => ({
  catalogs: catalogs && catalogs.items
});

const mapDispatchToProps = dispatch => ({
  fetchCatalogsIfNeeded: () => dispatch(fetchCatalogsIfNeededAction())
});

export const ConnectedReportStats = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportStats);
