import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getDataset } from '../../api/get-dataset';
import { DatasetDetailsPage } from './dataset-details-page';

const memoizedGetDataset = _.memoize(getDataset);

const mapProps = {
  datasetItem: props => memoizedGetDataset(props.match.params.id)
};

export const ResolvedDatasetDetailsPage = resolve(mapProps)(DatasetDetailsPage);
