import axios from 'axios';

export const getAPICatalogsByOrgNr = async orgNr => {
  const url = `/apicatalogs/get?organisationNumber=${orgNr}`;

  const response = await axios
    .get(url)
    .catch(e => console.error(JSON.stringify(e))); // eslint-disable-line no-console;

  return response && response.data;
};
