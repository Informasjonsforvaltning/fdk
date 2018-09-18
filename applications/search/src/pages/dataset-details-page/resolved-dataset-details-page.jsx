import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getDataset, getDatasetByURI } from '../../api/get-dataset';
import { DatasetDetailsPage } from './dataset-details-page';

const memoizedGetDataset = _.memoize(getDataset);
const memoizedGetDatasetByURI = _.memoize(getDatasetByURI);

const mapProps = {
  datasetItem: props => memoizedGetDataset(props.match.params.id),
  referencedItems: async props => {
    const datasetItem = await memoizedGetDataset(props.match.params.id);
    const urlArray = _.get(datasetItem, 'references', []).map(item =>
      _.get(item, ['source', 'uri'])
    );
    const promiseMap = urlArray.map(url =>
      memoizedGetDatasetByURI(encodeURIComponent(url))
    );
    const result = await Promise.all(promiseMap);
    return result;
  }
};

export const ResolvedDatasetDetailsPage = resolve(mapProps)(DatasetDetailsPage);
