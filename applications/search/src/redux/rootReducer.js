import { combineReducers } from 'redux';
import { themesReducer } from './modules/themes';
import { publishersReducer } from './modules/publishers';
import { datasetDetailsReducer } from './modules/datasetDetails';
import { openLicensesReducer } from './modules/openLicenses';
import { distributionTypesReducer } from './modules/distributionType';
import { featureToggleResolver } from './modules/featureToggle';
import { settingsResolver } from './modules/settings';
import { catalogsReducer } from './modules/catalogs';

export const rootReducer = combineReducers({
  datasetDetails: datasetDetailsReducer,
  themes: themesReducer,
  publishers: publishersReducer,
  openLicenses: openLicensesReducer,
  distributionTypes: distributionTypesReducer,
  featureToggle: featureToggleResolver,
  settings: settingsResolver,
  catalogs: catalogsReducer
});
