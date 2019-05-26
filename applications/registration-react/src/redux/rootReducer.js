import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import helptexts from './modules/helptexts';
import user from './modules/user';
import app from './modules/app';
import catalog from './modules/catalog';
import datasets from './modules/datasets';
import catalogs from './modules/catalogs';
import apis from './modules/apis';
import { featureToggleReducer } from './modules/featureToggle';
import apiFormStatus from './modules/api-form-status';
import { datasetFormStatus } from './modules/dataset-form-status';
import { apiCatalog } from './modules/apiCatalogs';
import { referenceDataReducer } from './modules/referenceData';

const rootReducer = combineReducers({
  form: formReducer,
  featureToggle: featureToggleReducer,
  app,
  helptexts,
  user,
  catalog,
  datasets,
  catalogs,
  apis,
  apiFormStatus,
  datasetFormStatus,
  apiCatalog,
  referenceData: referenceDataReducer
});

export default rootReducer;
