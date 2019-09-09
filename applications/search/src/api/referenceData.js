import axios from 'axios';
import { getConfig } from '../config';

const referenceDataUrlBase = () => `${getConfig().referenceDataApi.host}/reference-data`;

export const getReferenceData = path => axios(`${referenceDataUrlBase()}/${path}`).then(r => r.data);
