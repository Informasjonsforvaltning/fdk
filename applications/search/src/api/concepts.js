import axios from 'axios';
import get from 'lodash/get';
import { getConfig } from '../config';

export const conceptsUrlBase = () =>
  `${getConfig().conceptApi.host}/api/concepts`;

export const conceptsSearch = params =>
  axios
    .get(conceptsUrlBase(), {
      ...getConfig().conceptApi.config,
      params
    })
    .then(r => r.data);

export const getConcept = id =>
  axios
    .get(`${conceptsUrlBase()}/${id}`, getConfig().conceptApi.config)
    .then(r => r.data)
    .catch(() => null);

export const extractConcepts = searchResponse =>
  get(searchResponse, ['_embedded', 'concepts']);

export const extractAggregations = searchResponse =>
  get(searchResponse, 'aggregations');

export const extractTotal = searchResponse =>
  get(searchResponse, ['page', 'totalElements']);
