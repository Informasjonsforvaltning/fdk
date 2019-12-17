import get from 'lodash/get';
import { getConfig } from '../../../config';
import { searchApiGet } from './host';

export const getDatasetByURI = uri =>
  searchApiGet({
    url: `${getConfig().datasetApi.host}/api/datasets/byuri`,
    params: { uri },
    authorization: getConfig().datasetApi.authorization
  });

export const searchDatasets = params =>
  searchApiGet({
    url: `${getConfig().datasetApi.host}/api/datasets`,
    params,
    authorization: getConfig().datasetApi.authorization
  });

export const extractDatasets = searchResponse =>
  get(searchResponse, 'hits.hits', []).map(hit => hit._source);
