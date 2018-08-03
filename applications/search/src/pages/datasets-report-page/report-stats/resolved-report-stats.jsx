import { resolve } from 'react-resolver';
import axios from 'axios';
import { ReportStats } from './report-stats.component';

const mapProps = {
  aggregateDataset: async props => {
    const query = props.orgPath || '';
    const response = await axios.get(`/aggregateDataset?q=${query}`);

    return response.data;
  }
};

export const ResolvedReportStats = resolve(mapProps)(ReportStats);
