import url from 'url';
import { getConfig } from '../config';

const fetchOptions = () => {
  const options = {};
  const { authorization } = getConfig().referenceDataApi;
  if (authorization) {
    Object.assign(options, { headers: { authorization } });
  }
  return options;
};

const getRootUrl = () =>
  url.resolve(getConfig().referenceDataApi.host, '/reference-data/');

const resolvePath = path => url.resolve(getRootUrl(), path);

const get = path =>
  fetch(resolvePath(path), fetchOptions()).then(response => response.json());

export const referenceDataApi = {
  get
};
