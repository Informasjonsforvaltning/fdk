import axios from 'axios';

export const apisUrlBase = '/api/apis';

export const apisSearch = params => axios(apisUrlBase, { params }).then(r => r.data);

// NOTE: Response of this function can be mocked using mock files in src/mock
export const getApi = id =>
  axios
    .get(`${apisUrlBase}/${id}`)
    .then(response => response.data)
    .catch(e => console.error(JSON.stringify(e)));

export function extractApis(searchResponse) {
  return searchResponse && searchResponse.hits || [];
}

export function extractTotal(searchResponse) {
  return searchResponse && searchResponse.total;
}

export function extractAggregations(searchResponse) {
  return searchResponse && searchResponse.aggregations;
}
