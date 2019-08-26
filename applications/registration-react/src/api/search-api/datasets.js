import { getConfig } from '../../config';
import { searchApiGet } from './host';

export const getDatasetByURI = uri =>
  searchApiGet({
    url: `${getConfig().datasetApi.host}/api/datasets/byuri`,
    params: { uri },
    authorization: getConfig().datasetApi.authorization
  });

export const searchDatasets = ({ title, orgPath, returnFields }) =>
  searchApiGet({
    url: `${getConfig().datasetApi.host}/api/datasets`,
    params: { title, orgPath, returnFields },
    authorization: getConfig().datasetApi.authorization
  });
