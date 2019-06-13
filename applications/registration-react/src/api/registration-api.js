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

export const registrationApi = (method, path, jsonBody) => {
  const headers = { Accept: 'application/json' }; // required for cors
  if (jsonBody) {
    Object.assign(headers, { 'Content-Type': 'application/json' });
  }
  const body = jsonBody && JSON.stringify(jsonBody);
  return fetch(resolveUrl(path), { method, headers, body })
    .catch(normalizeFetchError)
    .then(normalizeFetchResponse);
};

export const registrationApiDelete = path => registrationApi('DELETE', path);

export const registrationApiPatch = (path, body) =>
  registrationApi('PATCH', path, body);

export const registrationApiPost = (path, body) =>
  registrationApi('POST', path, body);

export const registrationApiGet = path => registrationApi('GET', path);
