import axios from 'axios';

export const datasetsUrlBase = '/datasets';

export const datasetsSearch = params =>
  axios(datasetsUrlBase, { params }).then(r => r.data);

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
