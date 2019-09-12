import _ from 'lodash';
import first from 'lodash/first';
import { resolve } from 'react-resolver';
import { ApiDetailsPage } from './api-details-page';
import { getApi } from '../../api/apis';
import { getDatasetByURI } from '../../api/datasets';
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

const mapProps = {
  apiItem: props => memoizedGetApi(props.match.params.id),
  referencedDatasets: async props => {
    const getApi = await memoizedGetApi(props.match.params.id);
    const urlArray = _.get(getApi, 'datasetReferences', []).map(
      item => item.uri
    );

    const promiseMap = urlArray.map(url =>
      memoizedGetDatasetByURI(encodeURIComponent(url))
    );
    return (await Promise.all(promiseMap)).filter(Boolean);
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
