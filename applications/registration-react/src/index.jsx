import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './app/app';

import { configureStore } from './redux/configureStore';
import { initLocalization } from './services/localization';
import { initAuthService } from './services/auth/auth-service';

import './styles';

async function initServices() {
  initLocalization();
  await initAuthService();
}

async function main() {
  await initServices();
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
