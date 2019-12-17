import get from 'lodash/get';
import { getConfig } from '../../../config';
import { searchApiGet } from './host';

export const searchConcepts = params =>
  searchApiGet({
    url: `${getConfig().conceptApi.host}/api/concepts`,
    params,
    authorization: getConfig().conceptApi.authorization
  });

export const extractConcepts = searchResponse =>
  get(searchResponse, ['_embedded', 'concepts'], []);
