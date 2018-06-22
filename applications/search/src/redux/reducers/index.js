import { combineReducers } from 'redux';
import datasets, * as fromDatasets from './datasets';
import terms from './terms';
import themes from './themes';
import publishers from './publishers';
import datasetDetails from './datasetDetails';
import openLicenses, * as fromOpenLicenses from './openLicenses';
import distributionTypes, * as fromDistributionType from './distributionType';
import { featureToggleResolver } from './featureToggle';

const rootReducer = combineReducers({
  datasets,
  datasetDetails,
  terms,
  themes,
  publishers,
  openLicenses,
  distributionTypes,
  featureToggle: featureToggleResolver
});

export default rootReducer;

export const getDatasetById = (datasets, id) =>
  fromDatasets.getDatasetById(datasets, id);

export const getOpenLicenseByUri = (openLicenses, uri) =>
  fromOpenLicenses.getOpenLicenseByUri(openLicenses, uri);

export const getDistributionTypeByUri = (distributionTypeItems, uri) =>
  fromDistributionType.getDistributionTypeByUri(distributionTypeItems, uri);
