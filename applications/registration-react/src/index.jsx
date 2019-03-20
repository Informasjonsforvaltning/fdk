import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './redux/configureStore';
import { ConnectedFeatureToggleProvider } from './components/connected-feature-toggle-provider';
import { ConnectedApp } from './components/app/connected-app';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedFeatureToggleProvider>
      <ConnectedApp />
    </ConnectedFeatureToggleProvider>
  </Provider>,
  document.getElementById('root')
);
