import axios from 'axios';
import qs from 'qs';

const datasetsUrlBase = '/datasets';

export const datasetsSearchUrl = query =>
  `${datasetsUrlBase}${qs.stringify(
    { ...query, aggregations: 'true' },
    { addQueryPrefix: true }
  )}`;

export const getDataset = id =>
  axios
    .get(`${datasetsUrlBase}/${id}`)
    .then(response => response.data)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

export const getDatasetByURI = uri =>
  axios
    .get(`${datasetsUrlBase}/byuri?uri=${uri}`)
    .then(response => response.data)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console
