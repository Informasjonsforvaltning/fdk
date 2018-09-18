import axios from 'axios';

export const getDataset = async id => {
  const url = `/datasets/${id}`;

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && response.data;
};

export const getDatasetByURI = async uri => {
  const url = `/datasets/byuri?uri=${uri}`;

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && response.data;
};
