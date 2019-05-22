import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getApiByDatasetUri } from '../../../api/apis';

const memoizedGetApiByDatasetUri = _.memoize(getApiByDatasetUri);

const mapProps = {
  connectedApisByDatasetId: props =>
    memoizedGetApiByDatasetUri(_.get(props, 'datasetUri'), 'id,title,publisher')
};

export const resolver = resolve(mapProps);
