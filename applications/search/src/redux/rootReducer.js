import { combineReducers } from 'redux';
import { datasetsReducer } from './modules/datasets';
import { termsReducer } from './modules/terms';
import { themesReducer } from './modules/themes';
import { publishersReducer } from './modules/publishers';
import { datasetDetailsReducer } from './modules/datasetDetails';
import { openLicensesReducer } from './modules/openLicenses';
import { distributionTypesReducer } from './modules/distributionType';
import { featureToggleResolver } from './modules/featureToggle';
import { settingsResolver } from './modules/settings';

export const rootReducer = combineReducers({
  datasets: datasetsReducer,
  datasetDetails: datasetDetailsReducer,
  terms: termsReducer,
  themes: themesReducer,
  publishers: publishersReducer,
  openLicenses: openLicensesReducer,
  distributionTypes: distributionTypesReducer,
  featureToggle: featureToggleResolver,
  settings: settingsResolver
});
