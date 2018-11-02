import axios from 'axios';

export const getDatasetByURI = async uri => {
  const url = `/search-api/datasets/byuri?uri=${uri}`;

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && response.data;
};
