import { getConfig } from '../config';
import { searchApiGet } from './search-api/host';

export const searchConcepts = ({ prefLabel, returnFields }) =>
  searchApiGet({
    url: `${getConfig().conceptApi.host}/api/concepts`,
    params: { preflabel: prefLabel, returnFields },
    authorization: getConfig().conceptApi.authorization
  });
