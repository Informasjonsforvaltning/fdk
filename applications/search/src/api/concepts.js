import axios from 'axios';
import qs from 'qs';

export const datasetsUrlBase = '/datasets';
export const conceptsUrlBase = '/api/concepts';

export const searchAggregations = 'orgPath';

export const conceptsSearchUrl = query =>
  `${conceptsUrlBase}${qs.stringify(
    { ...query, aggregations: searchAggregations },
    { addQueryPrefix: true }
  )}`;

export const getDatasets = async id => {
  // NOTE: prod-like concept URI is used for all environments and may be a subject to change in the future
  const subject = `https://fellesdatakatalog.brreg.no/api/concepts/${id}`;
  return fetch(
    `${datasetsUrlBase}/?subject=${subject}&returnfields=id,uri,title`,
    {
      headers: { Accept: 'application/json' }
    }
  )
    .then(r => r.json())
    .then(r => (r.hits && r.hits.hits) || [])
    .then(r => r.map(hit => hit._source))
    .catch(() => []);
};

export const getConcept = async id =>
  axios
    .get(`${conceptsUrlBase}/${id}`)
    .then(response => response.data)
    .catch(console.error);

export const getConceptsByURIs = uris =>
  axios
    .get(`${conceptsSearchUrl({ uris })}`)
    .then(response => response.data)
    .catch(e => console.error(JSON.stringify(e)));
