import axios from 'axios';
import { getConfig } from '../config';

const catalogsUrlBase = () => `${getConfig().catalogApi.host}/catalogs`;

export const getAllCatalogs = () =>
  axios.get(catalogsUrlBase(), getConfig().catalogApi.config).then(r => r.data);
