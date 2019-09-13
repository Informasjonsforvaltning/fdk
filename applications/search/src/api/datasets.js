import axios from 'axios';
import get from 'lodash/get';
import { normalizeAggregations } from '../lib/normalizeAggregations';
import { getConfig } from '../config';

export const datasetsUrlBase = () =>
  `${getConfig().datasetApi.host}/api/datasets`;

export const datasetsSearch = params => {
  // Filter out NAP data if filterTransportDatasets in conf is true
  if (getConfig().filterTransportDatasets) {
    Object.assign(params, {
      accessrights: 'PUBLIC',
      losTheme: 'trafikk-reiser-og-samferdsel'
    });
  }

  return axios
    .get(datasetsUrlBase(), {
      params,
      headers: { authorization: getConfig().datasetApi.authorization }
    })
    .then(r => r.data);
};

export const getDataset = id =>
  axios
    .get(`${datasetsUrlBase()}/${id}`, {
      headers: { authorization: getConfig().datasetApi.authorization }
    })
    .then(r => r.data)
    .catch(() => null);

export const getDatasetByURI = uri =>
  axios
    .get(`${datasetsUrlBase()}/byuri`, {
      params: { uri },
      headers: { authorization: getConfig().datasetApi.authorization }
    })
    .then(r => r.data)
    .catch(() => null);

export const extractDatasets = searchResponse =>
  get(searchResponse, 'hits.hits', []).map(hit => hit._source);

export const extractTotal = searchResponse => get(searchResponse, 'hits.total');

export const extractAggregations = searchResponse =>
  searchResponse &&
  searchResponse.aggregations &&
  normalizeAggregations(searchResponse).aggregations;
