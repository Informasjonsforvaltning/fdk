import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './redux/configureStore';
import { initConfig } from './config';
import { initLocalization } from './lib/localization';
import { App } from './app/app';
import { initAuthService } from './auth/auth-service';

import './styles';

async function initServices() {
  await initConfig();
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
