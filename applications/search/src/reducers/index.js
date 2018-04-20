import { combineReducers } from 'redux';
import datasets, * as fromDatasets from './datasets';
import terms from './terms';
import themes from './themes';
import publishers from './publishers';
import datasetDetails from './datasetDetails';
import openLicenses, * as fromOpenLicenses from './openLicenses';

const rootReducer = combineReducers({
  datasets,
  datasetDetails,
  terms,
  themes,
  publishers,
  openLicenses
});

export default rootReducer;

export const getDatasetById = (datasets, id) =>
  fromDatasets.getDatasetById(datasets, id);

export const getOpenLicenseByUri = (openLicenses, uri) =>
  fromOpenLicenses.getOpenLicenseByUri(openLicenses, uri);
