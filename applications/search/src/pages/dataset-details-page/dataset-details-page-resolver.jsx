import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getDataset, getDatasetByURI } from '../../api/datasets';
import { apisSearch, extractApis, getApi } from '../../api/apis';

export const getApisByDatasetUri = dataseturi =>
  apisSearch({ dataseturi })
    .then(extractApis)
    .catch(() => []);

const memoizedGetDataset = _.memoize(getDataset);
const memoizedGetDatasetByURI = _.memoize(getDatasetByURI);
const memoizedGetApi = _.memoize(getApi);
const memoizedGetApisByDatasetUri = _.memoize(getApisByDatasetUri);

const mapProps = {
  datasetItem: props => memoizedGetDataset(props.match.params.id),
  referencedItems: async props => {
    const datasetItem = await memoizedGetDataset(props.match.params.id);
    const urlArray = _.get(datasetItem, 'references', []).map(item =>
      _.get(item, ['source', 'uri'])
    );
    const promiseMap = urlArray.map(memoizedGetDatasetByURI);
    return Promise.all(promiseMap);
  },
  apis: async props => {
    const datasetItem = await memoizedGetDataset(props.match.params.id);
    const apiIdArray = _.get(datasetItem, 'distribution', [])
      .filter(item => item.accessService)
      .map(item =>
        _.get(item, ['accessService', 'endpointDescription', 0, 'uri'])
      );

    const promiseMap = apiIdArray.map(id => memoizedGetApi(id));
    const referencedAPIsFromDistribution = await Promise.all(promiseMap);
    const apisReferringToDataset = await memoizedGetApisByDatasetUri(
      datasetItem.uri
    );

    return _.chain([
      ...referencedAPIsFromDistribution,
      ...apisReferringToDataset
    ])
      .filter()
      .uniqBy('id')
      .value();
  }
};

export const datasetDetailsPageResolver = resolve(mapProps);
