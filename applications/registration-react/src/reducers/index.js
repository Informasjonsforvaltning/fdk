import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import dataset from './dataset';
import helptexts from './helptexts';
import provenance from './provenance';
import frequency from './frequency';
import themes from './themes';
import user from './user';
import app from './app';
import referenceTypes from './referenceTypes';
import referenceDatasets from './referenceDatasets';
import catalog from './catalog';
import datasets from './datasets';
import catalogs from './catalogs';
import openlicenses from './openlicenses';

const rootReducer = combineReducers({
  form: formReducer,
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
  openlicenses
});

export default rootReducer;
