import axios from 'axios';

/*
This module implements access layer for all public fellesdatakatalog apis.
In production, the apis are mostly exposed under https://fellesdatakatalog.brreg.no/api,
but some are also under different root, e.g. reference-data

For developer convenience, different sub-apis can be configured on different hosts.
*/

export const searchApiGet = ({ url, params, authorization }) =>
  axios
    .get(url, {
      params,
      headers: { authorization, Accept: 'application/json' }
    })
    .then(r => r.data);
