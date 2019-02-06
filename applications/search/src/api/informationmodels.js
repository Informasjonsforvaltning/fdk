import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';

const informationmodelsUrlBase = `/api/informationmodels`;

export const informationmodelsSearchUrl = query =>
  `${informationmodelsUrlBase}${qs.stringify(
    { ...query, aggregations: 'true' },
    { addQueryPrefix: true }
  )}`;

export const getInformationmodel = id =>
  axios
    .get(`${informationmodelsUrlBase}/${id}`)
    .then(response => response.data)
    .catch(e => console.error(JSON.stringify(e))); // eslint-disable-line no-console;

export const getinformationModelByHarvestSourceUri = harvestSourceUri =>
  axios
    .get(`${informationmodelsUrlBase}?harvestSourceUri=${harvestSourceUri}`)
    .then(response => response.data)
    // harvestSourceUri is identificator, so there can be only one.
    .then(data => _.get(data, ['_embedded', 'informationmodels', 0]))
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console
