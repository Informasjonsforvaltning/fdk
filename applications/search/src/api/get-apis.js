import axios from 'axios';
import { addOrReplaceParam } from '../lib/addOrReplaceUrlParam';

export const getApis = async search => {
  const apisURL = `/api/apis/search${search || ''}`;
  const url = addOrReplaceParam(apisURL, 'size', '10');

  const response = await axios
    .get(url)
    .catch(e => console.error(JSON.stringify(e))); // eslint-disable-line no-console;

  return response && response.data;
};
