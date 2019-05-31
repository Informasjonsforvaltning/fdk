import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getApiByDatasetUri } from '../../../api/apis';

const memoizedGetApiByDatasetUri = _.memoize(getApiByDatasetUri);

const mapProps = {
  connectedApisByDatasetId: ({ datasetUri }) =>
    memoizedGetApiByDatasetUri(datasetUri, 'id,title,publisher')
};

export const formDistributionApiResolver = resolve(mapProps);
