import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './redux/configureStore';
import { ConnectedFeatureToggleProvider } from './components/feature-toggle/connected-feature-toggle-provider';
import { getConfig } from './services/config';
import { configureLocalization } from './lib/localization';
import { App } from './app/app';
import { configureReferenceDataApi } from './api/reference-data-api';
import { configureRegistrationApi } from './api/registration-api';

async function configureServices() {
  const config = await getConfig();
  const store = configureStore(config);
  configureLocalization(config.registrationLanguage);
  configureReferenceDataApi(config.referenceDataApi);
  configureRegistrationApi(config.registrationApi);

  return {
    store
  };
}

async function render() {
  const { store } = await configureServices();

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedFeatureToggleProvider>
        <App />
      </ConnectedFeatureToggleProvider>
    </Provider>,
    document.getElementById('root')
  );
}

render().catch(console.error);
