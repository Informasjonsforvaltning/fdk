import axios from 'axios';

export const searchApis = ({ title, datasetUri, returnFields }) =>
  axios({
    url: `/api/apis`,
    params: { title, dataseturi: datasetUri, returnFields }
  }).then(r => r.data);
