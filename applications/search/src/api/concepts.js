import axios from 'axios';
import get from 'lodash/get';

export const conceptsUrlBase = '/api/concepts';

export const conceptsSearch = params => axios(conceptsUrlBase, { params }).then(r => r.data);

export const getConcept = async id =>
  axios
    .get(`${conceptsUrlBase}/${id}`)
    .then(response => response.data)
    .catch(console.error);

export const extractConcepts = searchResponse => get(searchResponse, ['_embedded', 'concepts']);

export const extractAggregations = searchResponse => get(searchResponse, 'aggregations');

export const extractTotal = searchResponse => get(searchResponse, ['page', 'totalElements']);
