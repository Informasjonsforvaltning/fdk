import axios from 'axios';
import get from 'lodash/get';

const informationmodelsUrlBase = `/api/informationmodels`;

export const informationmodelsSearch = params =>
  axios.get(informationmodelsUrlBase, { params }).then(r => r.data);

export const getInformationmodel = id =>
  axios
    .get(`${informationmodelsUrlBase}/${id}`)
    .then(response => response.data)
    .catch(e => console.error(JSON.stringify(e)));

export const extractInformationmodels = searchResponse => get(searchResponse, ['_embedded', 'informationmodels']);

export const extractAggregations = searchResponse => get(searchResponse, 'aggregations');

export const extractTotal = searchResponse => get(searchResponse, ['page', 'totalElements']);
