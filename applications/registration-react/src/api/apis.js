import axios from 'axios';

const apisUrlBase = '/catalogs';

export const postApi = (catalogId, body) =>
  axios
    .post(`${apisUrlBase}/${catalogId}/apis`, body)
    .then(response => response.data);
