import axios from 'axios';
import { getConfig } from '../config';

export const apisUrlBase = () => `${getConfig().apiApi.host}/api/apis`;

export const apisSearch = params =>
  axios
    .get(apisUrlBase(), {
      ...getConfig().apiApi.config,
      params
    })
    .then(r => r.data);

// NOTE: Response of this function can be mocked using mock files in src/mock
export const getApi = id =>
  axios
    .get(`${apisUrlBase()}/${id}`, getConfig().apiApi.config)
    .then(r => r.data)
    .catch(() => null);

export function extractApis(searchResponse) {
  return (searchResponse && searchResponse.hits) || [];
}

export function extractTotal(searchResponse) {
  return searchResponse && searchResponse.total;
}

export function extractAggregations(searchResponse) {
  return searchResponse && searchResponse.aggregations;
}
