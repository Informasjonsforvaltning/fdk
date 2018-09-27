import { combineReducers } from 'redux';
import { themesReducer } from './modules/themes';
import { publishersReducer } from './modules/publishers';
import { featureToggleResolver } from './modules/featureToggle';
import { settingsResolver } from './modules/settings';
import { catalogsReducer } from './modules/catalogs';
import { referenceDataReducer } from './modules/referenceData';

export const rootReducer = combineReducers({
  themes: themesReducer,
  publishers: publishersReducer,
  featureToggle: featureToggleResolver,
  settings: settingsResolver,
  catalogs: catalogsReducer,
  referenceData: referenceDataReducer
});
