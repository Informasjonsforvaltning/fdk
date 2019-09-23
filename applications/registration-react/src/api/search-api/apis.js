import { getConfig } from '../../config';
import { searchApiGet } from './host';

export const searchApis = params =>
  searchApiGet({
    url: `${getConfig().apiApi.host}/api/apis`,
    params,
    authorization: getConfig().apiApi.authorization
  });
