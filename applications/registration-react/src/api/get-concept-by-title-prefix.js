import axios from 'axios';

export const getConceptByTitlePrefix = async (preflabel = '') => {
  const queryParams = `preflabel=${preflabel}`;

  const url = `/api/concepts?${queryParams}`;

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && response.data;
};
