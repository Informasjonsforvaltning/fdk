import _ from 'lodash';
import { resolve } from 'react-resolver';
import { ApiDetailsPage } from './api-details-page';
import { getApi } from '../../api/apis';
import { getDatasetByURI } from '../../api/datasets';
import { getinformationModelByHarvestSourceUri } from '../../api/informationmodels';

const memoizedGetApi = _.memoize(getApi);
const memoizedGetDatasetByURI = _.memoize(getDatasetByURI);
const memoizedGetinformationModelByHarvestSourceUri = _.memoize(
  getinformationModelByHarvestSourceUri
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
    const result = await Promise.all(promiseMap);
    return result;
  },
  referencedInformationModels: async props => {
    const apiItem = await memoizedGetApi(props.match.params.id);

    const harvestSourceUri = _.get(apiItem, 'harvestSourceUri');

    return Promise.resolve(
      memoizedGetinformationModelByHarvestSourceUri(harvestSourceUri)
    );
  }
};

export const ResolvedApiDetailsPage = resolve(mapProps)(ApiDetailsPage);
