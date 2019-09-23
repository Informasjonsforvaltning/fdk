import _ from 'lodash';
import first from 'lodash/first';
import { resolve } from 'react-resolver';
import { ApiDetailsPage } from './api-details-page';
import { getApi } from '../../api/apis';
import {
  datasetsSearch,
  extractDatasets,
  getDatasetByURI
} from '../../api/datasets';
import {
  extractInformationmodels,
  informationmodelsSearch
} from '../../api/informationmodels';

const getInformationModelByHarvestSourceUri = harvestSourceUri =>
  informationmodelsSearch({ harvestSourceUri })
    .then(extractInformationmodels)
    .then(first);

const memoizedGetApi = _.memoize(getApi);
const memoizedGetDatasetByURI = _.memoize(getDatasetByURI);
const memoizedGetInformationModelByHarvestSourceUri = _.memoize(
  getInformationModelByHarvestSourceUri
);

// todo when we migrate to dcat 2.0, we can have more reasonably link together datasets and apis,
//  right now it is api id stored in that peculiar property.
const getDatasetsByApiId = id =>
  datasetsSearch({
    distributionAccessServiceEndpointDescriptionUri: id,
    returnFields: 'id,title,publisher,description'
  }).then(extractDatasets);
const memoizedGetDatasetsByApiId = _.memoize(getDatasetsByApiId);

const mapProps = {
  apiItem: props => memoizedGetApi(props.match.params.id),
  referencedDatasets: async props => {
    const id = props.match.params.id;
    const getApi = await memoizedGetApi(id);
    const urlArray = _.get(getApi, 'datasetReferences', []).map(
      item => item.uri
    );

    return (await Promise.all(urlArray.map(memoizedGetDatasetByURI)))
      .concat(await memoizedGetDatasetsByApiId(id))
      .filter(Boolean);
  },
  referencedInformationModels: async props => {
    const apiItem = await memoizedGetApi(props.match.params.id);

    const harvestSourceUri = _.get(apiItem, 'harvestSourceUri');

    const informationmodel = await memoizedGetInformationModelByHarvestSourceUri(
      harvestSourceUri
    );

    // this method returns list of referenced information models, but our current api gives one
    return informationmodel ? [informationmodel] : [];
  }
};

export const ResolvedApiDetailsPage = resolve(mapProps)(ApiDetailsPage);
