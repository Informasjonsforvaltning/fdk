import url from 'url';
import {
  normalizeFetchError,
  normalizeFetchResponse
} from '../lib/normalize-fetch-response';

const registrationApiConfig = {};

export const configureRegistrationApi = newRegistrationApiConfig =>
  Object.assign(registrationApiConfig, newRegistrationApiConfig);

const getRootUrl = () => registrationApiConfig.host;
const resolveUrl = path => url.resolve(getRootUrl(), path);

const datasetUrl = (catalogId, datasetId) =>
  resolveUrl(`catalogs/${catalogId}/datasets/${datasetId}`);

const deleteMethod = url =>
  fetch(url, {
    method: 'DELETE',
    headers: { Accept: 'application/json' } // required for cors
  })
    .catch(normalizeFetchError)
    .then(normalizeFetchResponse);

const getMethod = url =>
  fetch(url)
    .catch(normalizeFetchError)
    .then(normalizeFetchResponse);

const get = path => getMethod(resolveUrl(path));

const deleteDataset = (catalogId, datasetId) =>
  deleteMethod(datasetUrl(catalogId, datasetId));

export const registrationApi = {
  get,
  deleteDataset
};
