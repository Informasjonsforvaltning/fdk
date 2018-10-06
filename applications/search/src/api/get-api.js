import axios from 'axios';

export const getApi = async id => {
  const url = `/api-cat/apis/${id}`;

  const response = await axios
    .get(url)
    .catch(e => console.error(JSON.stringify(e))); // eslint-disable-line no-console;

  return response && response.data;
};
