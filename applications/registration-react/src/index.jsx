import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './redux/configureStore';
import { ConnectedFeatureToggleProvider } from './components/feature-toggle/connected-feature-toggle-provider';
import { ConnectedApp } from './app/connected-app';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedFeatureToggleProvider>
      <ConnectedApp />
    </ConnectedFeatureToggleProvider>
  </Provider>,
  document.getElementById('root')
);
