import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './redux/configureStore';
import { getConfig, loadConfig } from './config';
import { configureLocalization } from './lib/localization';
import { App } from './app/app';
import { configureReferenceDataApi } from './api/reference-data-api';
import { configureRegistrationApi } from './api/registration-api';
import { getUserProfileThunk } from './redux/modules/user';

import './styles';

async function configureServices() {
  await loadConfig();
  const store = configureStore(getConfig().store);
  configureLocalization(getConfig().registrationLanguage);
  configureReferenceDataApi(getConfig().referenceDataApi);
  configureRegistrationApi(getConfig().registrationApi);

  store.dispatch(getUserProfileThunk());

  return { store };
}

async function main() {
  const { store } = await configureServices();

  const app = (
    <Provider store={store}>
      <App />
    </Provider>
  );

  ReactDOM.render(app, document.getElementById('root'));
}

main().catch(console.error);
