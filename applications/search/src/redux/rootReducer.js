import { combineReducers } from 'redux';
import { themesReducer } from './modules/themes';
import { publishersReducer } from './modules/publishers';
import { featureToggleReducer } from './modules/featureToggle';
import { settingsReducer } from './modules/settings';
import { catalogsReducer } from './modules/catalogs';
import { referenceDataReducer } from './modules/referenceData';
import { conceptsCompareReducer } from './modules/conceptsCompare';
import { datasetsReducer } from './modules/datasets';
import { apisReducer } from './modules/apis';
import { conceptReducer } from './modules/concepts';
import { informationModelsReducer } from './modules/informationModels';

export const rootReducer = combineReducers({
  themes: themesReducer,
  publishers: publishersReducer,
  featureToggle: featureToggleReducer,
  settings: settingsReducer,
  catalogs: catalogsReducer,
  referenceData: referenceDataReducer,
  conceptsCompare: conceptsCompareReducer,
  datasets: datasetsReducer,
  apis: apisReducer,
  concepts: conceptReducer,
  informationModels: informationModelsReducer
});
