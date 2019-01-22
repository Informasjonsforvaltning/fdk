import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { themesReducer } from './modules/themes';
import { publishersReducer } from './modules/publishers';
import { featureToggleResolver } from './modules/featureToggle';
import { settingsResolver } from './modules/settings';
import { catalogsReducer } from './modules/catalogs';
import { referenceDataReducer } from './modules/referenceData';
import { conceptsCompareReducer } from './modules/conceptsCompare';
import { searchReducer } from './modules/search';
import { datasets } from './modules/datasets';
import { apis } from './modules/apis';
import { concepts } from './modules/concepts';
import { informationModelsReducer } from './modules/informationModels';

export const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    themes: themesReducer,
    publishers: publishersReducer,
    featureToggle: featureToggleResolver,
    settings: settingsResolver,
    catalogs: catalogsReducer,
    referenceData: referenceDataReducer,
    conceptsCompare: conceptsCompareReducer,
    searchQuery: searchReducer,
    datasets,
    apis,
    concepts,
    informationModels: informationModelsReducer
  });
