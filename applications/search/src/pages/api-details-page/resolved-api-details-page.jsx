import _ from 'lodash';
import { resolve } from 'react-resolver';
import { ApiDetailsPage } from './api-details-page';
import { getApi } from '../../api/apis';
import { getDatasetByURI } from '../../api/datasets';

const memoizedGetApi = _.memoize(getApi);
const memoizedGetDatasetByURI = _.memoize(getDatasetByURI);

const mapProps = {
  apiItem: props => memoizedGetApi(props.match.params.id),
  referencedDatasets: async props => {
    const getApi = await memoizedGetApi(props.match.params.id);
    const urlArray = _.get(getApi, 'datasetReferences', []).map(
      item => item.uri
    );

    const promiseMap = urlArray.map(url =>
      memoizedGetDatasetByURI(encodeURIComponent(url))
    );
    const result = await Promise.all(promiseMap);
    return result;
  }
};

export const ResolvedApiDetailsPage = resolve(mapProps)(ApiDetailsPage);
