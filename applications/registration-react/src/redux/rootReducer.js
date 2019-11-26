import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import catalog from './modules/catalog';
import datasets from './modules/datasets';
import catalogs from './modules/catalogs';
import apis from './modules/apis';
import apiFormStatus from './modules/api-form-status';
import inputLanguage from '../components/language-picker/redux/reducer';
import { datasetFormStatus } from './modules/dataset-form-status';
import { apiCatalog } from './modules/apiCatalogs';
import { referenceDataReducer } from './modules/referenceData';

const rootReducer = combineReducers({
  form: formReducer,
  catalog,
  datasets,
  catalogs,
  apis,
  apiFormStatus,
  datasetFormStatus,
  apiCatalog,
  referenceData: referenceDataReducer,
  inputLanguage
});

export default rootReducer;
