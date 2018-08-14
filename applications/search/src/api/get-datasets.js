import axios from 'axios';
import { addOrReplaceParam } from '../lib/addOrReplaceUrlParam';

export const getDatasets = async search => {
  const datasetsUrl = `/datasets${search}`;
  const url = addOrReplaceParam(datasetsUrl, 'size', '50');

  const response = await axios.get(url);

  return response.data;
};
