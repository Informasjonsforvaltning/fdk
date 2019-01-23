import axios from 'axios';

import { addOrReplaceParam } from '../lib/addOrReplaceUrlParam';
import { normalizeAggregations } from './../lib/normalizeAggregations';

export const getDatasets = async search => {
  const datasetsUrl = `/datasets${search}`;
  const url = addOrReplaceParam(datasetsUrl, 'size', '10');

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && normalizeAggregations(response.data);
};
