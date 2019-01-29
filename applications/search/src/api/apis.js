import qs from 'qs';
import axios from 'axios';

const apisUrlBase = '/api/apis';

export const apisSearchUrl = query =>
  `${apisUrlBase}${qs.stringify(
    { ...query, aggregations: 'true' },
    { addQueryPrefix: true }
  )}`;

export const getApi = id =>
  axios
    .get(`${apisUrlBase}/${id}`)
    .then(response => response.data)
    .catch(e => console.error(JSON.stringify(e))); // eslint-disable-line no-console;
