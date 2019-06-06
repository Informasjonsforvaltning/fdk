import axios from 'axios';
import qs from 'qs';

export const conceptsUrlBase = `/api/concepts`;

export const searchAggregations = 'orgPath';

export const conceptsSearchUrl = query =>
  `${conceptsUrlBase}${qs.stringify(
    { ...query, aggregations: searchAggregations },
    { addQueryPrefix: true }
  )}`;

export const getConcept = id =>
  axios
    .get(`${conceptsUrlBase}/${id}`)
    .then(response => response.data)
    .catch(e => console.error(JSON.stringify(e)));

export const getConceptsByURIs = uris =>
  axios
    .get(`${conceptsSearchUrl({ uris })}`)
    .then(response => response.data)
    .catch(e => console.error(JSON.stringify(e)));
