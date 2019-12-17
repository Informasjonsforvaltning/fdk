import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import catalog from './modules/catalog';
import { datasetsReducer } from './modules/datasets';
import catalogs from './modules/catalogs';
import { apisReducer } from './modules/apis';
import { apiFormStatusReducer } from './modules/api-form-status';
import inputLanguage from '../components/language-picker/redux/reducer';
import { datasetFormStatus } from './modules/dataset-form-status';
import { apiCatalogReducer } from './modules/apiCatalogs';
import { referenceDataReducer } from './modules/referenceData';

const rootReducer = combineReducers({
  form: formReducer,
  catalog,
  datasets: datasetsReducer,
  catalogs,
  apis: apisReducer,
  apiFormStatus: apiFormStatusReducer,
  datasetFormStatus,
  apiCatalog: apiCatalogReducer,
  referenceData: referenceDataReducer,
  inputLanguage
});

export default rootReducer;
