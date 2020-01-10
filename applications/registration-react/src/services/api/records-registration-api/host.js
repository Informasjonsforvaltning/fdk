import axios from 'axios';
import { authService } from '../../auth/auth-service';
import { getConfig } from '../../../config';

export const getRecords = async orgnr =>
  axios
    .get(
      `${
        getConfig().recordsOfProcessingActivitiesApi
      }/api/organizations/${orgnr}/records`,
      {
        headers: {
          Authorization: await authService.getAuthorizationHeader(),
          Accept: 'application/json'
        }
      }
    )
    .then(response => response.data);

export const getRecordsCount = orgnr =>
  getRecords(orgnr).then(data => data && data.hits && data.hits.length);
