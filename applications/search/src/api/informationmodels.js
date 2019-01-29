import axios from 'axios';
import qs from 'qs';

const informationmodelsUrlBase = `/api/informationmodels`;

export const informationmodelsSearchUrl = query =>
  `${informationmodelsUrlBase}${qs.stringify(
    { ...query, aggregations: 'true' },
    { addQueryPrefix: true }
  )}`;

export const getInformationmodel = id =>
  axios
    .get(`${informationmodelsUrlBase}/${id}`)
    .then(response => response.data)
    .catch(e => console.error(JSON.stringify(e))); // eslint-disable-line no-console;
