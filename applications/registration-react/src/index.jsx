import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './redux/configureStore';
import { loadConfig } from './config';
import { configureLocalization } from './lib/localization';
import { App } from './app/app';
import { userFailureAction, userSuccessAction } from './redux/modules/user';
import { configureAuth, getUserProfile } from './auth/auth-service';

import './styles';

async function configureServices() {
  await loadConfig();
  const store = configureStore();
  configureLocalization();

  await configureAuth({
    onAuthSuccess: () => {
      const user = getUserProfile();
      store.dispatch(userSuccessAction({ user }));
    },
    onAuthError: error => store.dispatch(userFailureAction({ error }))
  });

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
