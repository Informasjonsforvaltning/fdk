import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './redux/configureStore';
import { ConnectedFeatureToggleProvider } from './components/feature-toggle/connected-feature-toggle-provider';
import { InjectablesContext } from './lib/injectables';
import { getConfig } from './services/config';
import { configureLocalization } from './lib/localization';
import { App } from './app/app';
import { configureReferenceDataApi } from './api/reference-data-api';

async function configureInjectables() {
  const config = await getConfig();
  const store = configureStore(config.store);
  const localization = configureLocalization(config.registrationLanguage);
  const referenceDataApi = configureReferenceDataApi(config.referenceDataApi);

  return { config, store, localization, referenceDataApi };
}

async function render() {
  const injectables = await configureInjectables();

  ReactDOM.render(
    <InjectablesContext.Provider value={injectables}>
      <Provider store={injectables.store}>
        <ConnectedFeatureToggleProvider>
          <App />
        </ConnectedFeatureToggleProvider>
      </Provider>
    </InjectablesContext.Provider>,
    document.getElementById('root')
  );
}

render().catch(console.error);
