import axios from 'axios';

const apisUrlBase = '/catalogs';

export const postApi = (catalogId, body) =>
  axios
    .post(`${apisUrlBase}/${catalogId}/apis`, body)
    .then(response => response.data);

export const patchApi = (catalogId, apiId, body) =>
  axios
    .patch(`${apisUrlBase}/${catalogId}/apis/${apiId}`, body)
    .then(response => response.data);
