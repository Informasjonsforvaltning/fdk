import axios from 'axios';

export const getDatasetByURI = uri =>
  axios
    .get('/search-api/datasets/byuri', { params: { uri } })
    .then(r => r.data);

export const searchDatasets = ({ title, orgPath, returnFields }) =>
  axios
    .get('/search-api/datasets', { params: { title, orgPath, returnFields } })
    .then(r => r.data);
