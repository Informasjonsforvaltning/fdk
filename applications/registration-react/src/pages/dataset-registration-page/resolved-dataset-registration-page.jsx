import _ from 'lodash';
import { resolve } from 'react-resolver';
import { RegDataset } from './dataset-registration-page';
import { getDatasetById } from '../../api/get-dataset';

const memoizedGetDatasetById = _.memoize(getDatasetById);

const mapProps = {
  datasetItem: props =>
    memoizedGetDatasetById(
      _.get(props.match, ['params', 'id']),
      _.get(props.match, ['params', 'catalogId'])
    )
};

export const ResolvedRegDataset = resolve(mapProps)(RegDataset);
