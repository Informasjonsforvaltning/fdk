import axios from 'axios';
import _ from 'lodash';
import { addOrReplaceParam } from '../lib/addOrReplaceUrlParam';

export const getApi = async id => {
  const apisURL = `/api-cat/api/search`;
  const url = addOrReplaceParam(apisURL, 'size', '50');

  const response = await axios
    .get(url)
    .catch(e => console.error(JSON.stringify(e))); // eslint-disable-line no-console;

  return (
    response && _.find(response.data.hits, ['uri', decodeURIComponent(id)])
  );
};
