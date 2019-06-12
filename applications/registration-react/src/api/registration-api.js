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

export const deleteMethod = path =>
  fetch(resolveUrl(path), {
    method: 'DELETE',
    headers: { Accept: 'application/json' } // required for cors
  })
    .catch(normalizeFetchError)
    .then(normalizeFetchResponse);

export const getMethod = path =>
  fetch(resolveUrl(path))
    .catch(normalizeFetchError)
    .then(normalizeFetchResponse);
