import axios from 'axios';
import { getConfig } from '../config';

const catalogsUrlBase = () => `${getConfig().catalogApi.host}/catalogs`;

export const getAllCatalogs = () =>
  axios
    .get(catalogsUrlBase(), {
      headers: { authorization: getConfig().catalogApi.authorization }
    })
    .then(r => r.data);
