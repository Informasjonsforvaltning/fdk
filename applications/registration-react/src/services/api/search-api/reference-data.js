import { getConfig } from '../../../config';
import { searchApiGet } from './host';

export const getReferenceData = path =>
  searchApiGet({
    url: `${getConfig().referenceDataApi.host}/reference-data/${path}`,
    authorization: getConfig().referenceDataApi.authorization
  });
