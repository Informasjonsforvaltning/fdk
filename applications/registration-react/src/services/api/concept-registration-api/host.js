import axios from 'axios';
import { getToken } from '../../auth/auth-service';
import { getConfig } from '../../../config';

export const getConcepts = async orgnr =>
  axios
    .get(`${getConfig().conceptRegistrationApi.host}/begreper`, {
      params: { orgNummer: orgnr },
      headers: { Authorization: `Bearer ${await getToken()}` }
    })
    .then(r => r.data);

export const getConceptCount = orgnr =>
  getConcepts(orgnr).then(concepts => concepts.length);
