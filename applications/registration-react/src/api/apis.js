import { getConfig } from '../config';
import { searchApiGet } from './search-api/host';

export const searchApis = ({ title, datasetUri, returnFields }) =>
  searchApiGet({
    url: `${getConfig().apiApi.host}/api/apis`,
    params: { title, dataseturi: datasetUri, returnFields },
    authorization: getConfig().apiApi.authorization
  });
