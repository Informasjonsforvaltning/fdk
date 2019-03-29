import _ from 'lodash';
import { resolve } from 'react-resolver';
import { ConfiguredFormDistributionAPI } from './configured-form-distribution-api';
import { getApiByDatasetUri } from '../../../api/apis';

const memoizedGetApiByDatasetUri = _.memoize(getApiByDatasetUri);

const mapProps = {
  connectedApisByDatasetId: props =>
    memoizedGetApiByDatasetUri(_.get(props, 'datasetUri'), 'id,title,publisher')
};

export const ResolvedFormDistributionAPI = resolve(mapProps)(
  ConfiguredFormDistributionAPI
);
