import axios from 'axios';
import get from 'lodash/get';
import { normalizeAggregations } from '../lib/normalizeAggregations';
import { getConfig } from '../config';

export const datasetsUrlBase = () =>
  `${getConfig().datasetApi.host}/api/datasets`;

// Filter out NAP data if filterTransportDatasets in conf is true
const transportProfileIfNeeded = () =>
  getConfig().filterTransportDatasets
    ? {
        accessrights: 'PUBLIC',
        themeprofile: 'transport'
      }
    : undefined;

export const datasetsSearch = params =>
  axios
    .get(datasetsUrlBase(), {
      ...getConfig().datasetApi.config,
      params: {
        ...params,
        ...transportProfileIfNeeded()
      }
    })
    .then(r => r.data);

export const getDataset = id =>
  axios
    .get(`${datasetsUrlBase()}/${id}`, getConfig().datasetApi.config)
    .then(r => r.data)
    .catch(() => null);

export const getDatasetByURI = uri =>
  axios
    .get(`${datasetsUrlBase()}/byuri`, {
      ...getConfig().datasetApi.config,
      params: { uri }
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
