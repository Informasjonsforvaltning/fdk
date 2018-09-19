import axios from 'axios';

export const getDataset = async id => {
  const url = `/datasets/${id}`;

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && response.data;
};
