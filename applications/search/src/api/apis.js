import qs from 'qs';
import axios from 'axios';

const apisUrlBase = '/api/apis';

export const searchAggregations = 'formats,orgPath';

export const apisSearchUrl = query =>
  `${apisUrlBase}${qs.stringify(
    { ...query, aggregations: searchAggregations },
    { addQueryPrefix: true }
  )}`;

export const getApi = id =>
  axios
    .get(`${apisUrlBase}/${id}`)
    .then(response => response.data)
    .catch(e => console.error(JSON.stringify(e))); // eslint-disable-line no-console;

export const getApiByHarvestSourceUri = harvestSourceUri =>
  axios
    .get(`${apisUrlBase}?harvestSourceUri=${harvestSourceUri}`)
    .then(response => response.data)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console
