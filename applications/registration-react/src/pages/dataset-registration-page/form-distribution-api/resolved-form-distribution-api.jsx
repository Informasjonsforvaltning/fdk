import _ from 'lodash';
import { resolve } from 'react-resolver';
import { ConfiguredFormDistributionAPI } from './configured-form-distribution-api';
import { getApiByDatasetId } from '../../../api/apis';

const memoizedGetApiByDatasetId = _.memoize(getApiByDatasetId);

const mapProps = {
  connectedApisByDatasetId: props =>
    memoizedGetApiByDatasetId(_.get(props, 'datasetId'), 'id,title,publisher')
};

export const ResolvedFormDistributionAPI = resolve(mapProps)(
  ConfiguredFormDistributionAPI
);
