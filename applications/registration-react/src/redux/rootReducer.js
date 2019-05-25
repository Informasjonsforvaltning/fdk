import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import helptexts from './modules/helptexts';
import provenance from './modules/provenance';
import user from './modules/user';
import app from './modules/app';
import referenceDatasets from './modules/referenceDatasets';
import catalog from './modules/catalog';
import datasets from './modules/datasets';
import catalogs from './modules/catalogs';
import apis from './modules/apis';
import { featureToggleReducer } from './modules/featureToggle';
import apiFormStatus from './modules/api-form-status';
import { datasetFormStatus } from './modules/dataset-form-status';
import { apiCatalog } from './modules/apiCatalogs';
import { referenceDataReducer } from './modules/referenceData';
import { config } from './modules/config';

const rootReducer = combineReducers({
  form: formReducer,
  featureToggle: featureToggleReducer,
  app,
  helptexts,
  provenance,
  user,
  referenceDatasets,
  catalog,
  datasets,
  catalogs,
  apis,
  apiFormStatus,
  datasetFormStatus,
  apiCatalog,
  referenceData: referenceDataReducer,
  config
});

export default rootReducer;
