import axios from 'axios';
import get from 'lodash/get';
import { getConfig } from '../config';

const informationmodelsUrlBase = () => `${getConfig().informationmodelApi.host}/api/informationmodels`;

export const informationmodelsSearch = params =>
  axios.get(
    informationmodelsUrlBase(),
    {
      params,
      headers: { authorization: getConfig().informationmodelApi.authorization }
    }
  )
    .then(r => r.data);

export const getInformationmodel = id =>
  axios.get(
    `${informationmodelsUrlBase()}/${id}`,
    { headers: { authorization: getConfig().informationmodelApi.authorization } }
  )
    .then(r => r.data)
    .catch(() => null);

export const extractInformationmodels = searchResponse => get(searchResponse, ['_embedded', 'informationmodels']);

export const extractAggregations = searchResponse => get(searchResponse, 'aggregations');

export const extractTotal = searchResponse => get(searchResponse, ['page', 'totalElements']);
