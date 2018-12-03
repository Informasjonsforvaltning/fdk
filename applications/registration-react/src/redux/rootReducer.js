import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import dataset from './modules/dataset';
import helptexts from './modules/helptexts';
import provenance from './modules/provenance';
import frequency from './modules/frequency';
import themes from './modules/themes';
import user from './modules/user';
import app from './modules/app';
import referenceTypes from './modules/referenceTypes';
import referenceDatasets from './modules/referenceDatasets';
import catalog from './modules/catalog';
import datasets from './modules/datasets';
import catalogs from './modules/catalogs';
import openlicenses from './modules/openlicenses';
import apis from './modules/apis';
import { featureToggleReducer } from './modules/featureToggle';
import apiFormStatus from './modules/api-form-status';
import { datasetFormStatus } from './modules/dataset-form-status';

const rootReducer = combineReducers({
  form: formReducer,
  featureToggle: featureToggleReducer,
  app,
  dataset,
  helptexts,
  provenance,
  frequency,
  themes,
  user,
  referenceTypes,
  referenceDatasets,
  catalog,
  datasets,
  catalogs,
  openlicenses,
  apis,
  apiFormStatus,
  datasetFormStatus
});

export default rootReducer;
