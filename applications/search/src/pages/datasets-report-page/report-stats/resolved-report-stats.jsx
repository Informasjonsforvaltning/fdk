import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getDatasetStats } from '../../../api/get-dataset-stats';
import { ConnectedReportStats } from './connected-report-stats';
import { getApiStats } from '../../../api/get-api-stats';
import { getConceptStats } from '../../../api/get-concept-stats';

const memoizedGetDatasetStats = _.memoize(getDatasetStats);
const memoizedGetApiStats = _.memoize(getApiStats);
const memoizedGetConceptStats = _.memoize(getConceptStats);

const mapProps = {
  datasetStats: props => memoizedGetDatasetStats({ orgPath: props.orgPath }),
  apiStats: props => memoizedGetApiStats({ orgPath: props.orgPath }),
  conceptStats: props => memoizedGetConceptStats({ orgPath: props.orgPath })
};

export const ResolvedReportStats = resolve(mapProps)(ConnectedReportStats);
