import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './redux/configureStore';
import { loadConfig } from './config';
import { configureLocalization } from './lib/localization';
import { App } from './app/app';
import { initAuth } from './auth/auth-service';

import './styles';

async function configureServices() {
  await loadConfig();
  configureLocalization();
  await initAuth();
}

async function main() {
  await configureServices();
  const store = configureStore();

  const app = (
    <Provider store={store}>
      <App />
    </Provider>
  );

  ReactDOM.render(app, document.getElementById('root'));
}

main().catch(console.error);

if (module.hot) {
  module.hot.accept();
}
