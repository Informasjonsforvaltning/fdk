import { combineReducers } from 'redux';
import { themesReducer } from './modules/themes';
import { publishersReducer } from './modules/publishers';
import { openLicensesReducer } from './modules/openLicenses';
import { distributionTypesReducer } from './modules/distributionType';
import { featureToggleResolver } from './modules/featureToggle';
import { settingsResolver } from './modules/settings';
import { catalogsReducer } from './modules/catalogs';
import { apisReducer } from './modules/apis';

export const rootReducer = combineReducers({
  themes: themesReducer,
  publishers: publishersReducer,
  openLicenses: openLicensesReducer,
  distributionTypes: distributionTypesReducer,
  featureToggle: featureToggleResolver,
  settings: settingsResolver,
  catalogs: catalogsReducer,
  apis: apisReducer
});
