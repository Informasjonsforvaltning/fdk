import axios from 'axios';

export const getConcept = async id => {
  const url = `/api/concepts/${id}`;

  const response = await axios
    .get(url)
    .catch(e => console.error(JSON.stringify(e))); // eslint-disable-line no-console;

  return response && response.data;
};
