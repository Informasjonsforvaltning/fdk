import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './redux/configureStore';
import { ConnectedFeatureToggleProvider } from './components/feature-toggle/connected-feature-toggle-provider';
import { ConnectedApp } from './app/connected-app';
import { InjectablesContext } from './lib/injectables';
import { getConfig } from './services/config';
import { configureLocalization } from './lib/localization';

async function configureInjectables() {
  const config = await getConfig();
  const store = configureStore();
  const localization = configureLocalization(config.registrationLanguage);

  return { config, store, localization };
}

async function render() {
  const injectables = await configureInjectables();

  ReactDOM.render(
    <InjectablesContext.Provider value={injectables}>
      <Provider store={injectables.store}>
        <ConnectedFeatureToggleProvider>
          <ConnectedApp />
        </ConnectedFeatureToggleProvider>
      </Provider>
    </InjectablesContext.Provider>,
    document.getElementById('root')
  );
}

render().catch(console.error);
