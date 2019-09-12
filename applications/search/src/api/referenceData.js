import axios from 'axios';
import { getConfig } from '../config';

const referenceDataUrlBase = () =>
  `${getConfig().referenceDataApi.host}/reference-data`;

export const getReferenceData = path =>
  axios
    .get(`${referenceDataUrlBase()}/${path}`, {
      headers: { authorization: getConfig().referenceDataApi.authorization }
    })
    .then(r => r.data);
