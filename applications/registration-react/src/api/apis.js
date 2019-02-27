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

export const getAPIById = async (id, catalogId) => {
  const url = `${apisUrlBase}/${catalogId}/apis/${id}`;

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && response.data;
};
