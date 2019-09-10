import axios from 'axios';
import { getConfig } from '../config';
import get from 'lodash/get';

const publishersUrlBase = () => `${getConfig().publisherApi.host}/publisher`;

export const getAllPublishers = () =>
  axios.get(
    publishersUrlBase(),
    { headers: { authorization: getConfig().publisherApi.authorization } }
  )
    .then(r => r.data)
    .then(extractPublishers);

export const extractPublishers = searchResponse => get(searchResponse, 'hits.hits', []).map(h => h._source);
