import axios from 'axios';
import qs from 'qs';

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

export const getApiByDatasetUri = async (datasetUri, returnFields) => {
  const query = `${qs.stringify(
    {
      dataseturi: datasetUri,
      returnFields
    },
    { addQueryPrefix: true }
  )}`;

  const url = `/api/apis${query}`;

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && response.data;
};
