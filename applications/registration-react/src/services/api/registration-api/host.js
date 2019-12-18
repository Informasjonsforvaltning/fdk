import axios from 'axios';
import { getToken } from '../../auth/auth-service';
import { getConfig } from '../../../config';

export const registrationApi = async (method, path, data) =>
  axios({
    url: `${getConfig().registrationApi.host}${path}`,
    method,
    data,
    headers: {
      Authorization: `Bearer ${await getToken()}`,
      Accept: 'application/json'
    }
  }).then(r => r.data);

export const registrationApiDelete = path => registrationApi('DELETE', path);

export const registrationApiPatch = (path, body) =>
  registrationApi('PATCH', path, body);

export const registrationApiPost = (path, body) =>
  registrationApi('POST', path, body);

export const registrationApiPut = (path, body) =>
  registrationApi('PUT', path, body);

export const registrationApiGet = path => registrationApi('GET', path);
