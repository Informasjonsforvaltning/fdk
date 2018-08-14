import { resolve } from 'react-resolver';
import { getDatasetStats } from '../../../api/get-dataset-stats';
import { ConnectedReportStats } from './connected-report-stats';

const mapProps = {
  stats: props => getDatasetStats(props.orgPath)
};

export const ResolvedReportStats = resolve(mapProps)(ConnectedReportStats);
