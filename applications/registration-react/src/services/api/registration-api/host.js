import axios from 'axios';
import { authService } from '../../auth/auth-service';
import { getConfig } from '../../../config';

export const registrationApi = async (method, path, data) => {
  const Authorization = await authService.getAuthorizationHeader();
  const response = await axios({
    url: `${getConfig().registrationApi.host}${path}`,
    method,
    data,
    headers: {
      Authorization,
      Accept: 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
  return response.data;
};

export const registrationApiDelete = path => registrationApi('DELETE', path);

export const registrationApiPatch = (path, body) =>
  registrationApi('PATCH', path, body);

export const registrationApiPost = (path, body) =>
  registrationApi('POST', path, body);

export const registrationApiPut = (path, body) =>
  registrationApi('PUT', path, body);

export const registrationApiGet = path => registrationApi('GET', path);
