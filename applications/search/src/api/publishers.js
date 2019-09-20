import axios from 'axios';
import get from 'lodash/get';
import { getConfig } from '../config';

const publishersUrlBase = () => `${getConfig().publisherApi.host}/publisher`;

export const extractPublishers = searchResponse =>
  get(searchResponse, 'hits.hits', []).map(h => h._source);

export const getAllPublishers = () =>
  axios
    .get(publishersUrlBase(), getConfig().publisherApi.config)
    .then(r => r.data)
    .then(extractPublishers);

export const getPublisherHierarchy = () =>
  axios
    .get(`${publishersUrlBase()}/hierarchy`, getConfig().publisherApi.config)
    .then(r => r.data);
