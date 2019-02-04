import { combineReducers } from 'redux';
import { themesReducer } from './modules/themes';
import { publishersReducer } from './modules/publishers';
import { featureToggleResolver } from './modules/featureToggle';
import { settingsResolver } from './modules/settings';
import { catalogsReducer } from './modules/catalogs';
import { referenceDataReducer } from './modules/referenceData';
import { conceptsCompareReducer } from './modules/conceptsCompare';
import { datasets } from './modules/datasets';
import { apis } from './modules/apis';
import { concepts } from './modules/concepts';
import { informationModelsReducer } from './modules/informationModels';

export const rootReducer = combineReducers({
  themes: themesReducer,
  publishers: publishersReducer,
  featureToggle: featureToggleResolver,
  settings: settingsResolver,
  catalogs: catalogsReducer,
  referenceData: referenceDataReducer,
  conceptsCompare: conceptsCompareReducer,
  datasets,
  apis,
  concepts,
  informationModels: informationModelsReducer
});
