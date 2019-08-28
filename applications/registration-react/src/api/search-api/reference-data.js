import url from 'url';
import { getConfig } from '../../config';
import { searchApiGet } from './host';

const getRootUrl = () =>
  url.resolve(getConfig().referenceDataApi.host, '/reference-data/');
const getAuthorization = () => getConfig().referenceDataApi.authorization;

const resolvePath = path => url.resolve(getRootUrl(), path);

export const getReferenceData = path =>
  searchApiGet(resolvePath(path), getAuthorization());
