import _ from 'lodash';
import qs from 'qs';
import axios from 'axios';

export const apisUrlBase = '/api/apis';

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

export const getApisByDatasetUri = async (datasetUri, returnFields) => {
  const query = `${qs.stringify(
    {
      dataseturi: datasetUri,
      returnFields
    },
    { addQueryPrefix: true }
  )}`;

  const url = `/api/apis${query}`;

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return _.get(response, ['data', 'hits']);
};
