import qs from 'qs';
import axios from 'axios';

const apisUrlBase = '/api/apis';

export const apisSearchUrl = query =>
  `${apisUrlBase}/search${qs.stringify(query, { addQueryPrefix: true })}`;

export const getApi = id =>
  axios
    .get(`${apisUrlBase}/${id}`)
    .then(response => response.data)
    .catch(e => console.error(JSON.stringify(e))); // eslint-disable-line no-console;
