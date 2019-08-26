import url from 'url';
import {
  normalizeFetchError,
  normalizeFetchResponse
} from '../lib/normalize-fetch-response';
import { getToken } from '../auth/auth-service';
import { getConfig } from '../config';

const getRootUrl = () => getConfig().registrationApi.host;
const resolveUrl = path => url.resolve(getRootUrl(), path);

export const registrationApi = async (method, path, jsonBody) => {
  const headers = {
    Accept: 'application/json', // required for cors
    Authorization: `Bearer ${await getToken()}`
  };
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

export const registrationApiPut = (path, body) =>
  registrationApi('PUT', path, body);

export const registrationApiGet = path => registrationApi('GET', path);
