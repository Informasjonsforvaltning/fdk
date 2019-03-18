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

export const getAPIByTitlePrefix = async (
  title = '',
  orgPath,
  returnFields
) => {
  const queryParams = `title=${title}${orgPath ? `&orgPath=${orgPath}` : ''}${
    returnFields ? `&returnfields=${returnFields}` : ''
  }`;

  const url = `/api/apis?${queryParams}`;

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && response.data;
};

export const getApiByDatasetId = async (datasetId, returnFields) => {
  const queryParams = `datasetid=${datasetId}${
    returnFields ? `&returnFields=${returnFields}` : ''
  }`;

  const url = `/api/apis?${queryParams}`;

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && response.data;
};
