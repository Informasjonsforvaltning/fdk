import axios from 'axios';

export const getPublisherByOrgNr = async orgNr => {
  const url = `/publishers/${orgNr}`;

  const response = await axios
    .get(url)
    .catch(e => console.error(JSON.stringify(e))); // eslint-disable-line no-console;

  return response && response.data;
};
