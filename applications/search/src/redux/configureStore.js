import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import persistState from 'redux-localstorage';

import api from './middleware/api';
import rootReducer from './reducers/index';
import { config } from '../config';

function selectCompose() {
  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

export function configureStore() {
  const middlewares = [thunk, api];
  if (config.reduxLog) {
    middlewares.push(createLogger());
  }

  const selectedCompose = selectCompose();

  const enhancer = selectedCompose(
    applyMiddleware(...middlewares),
    persistState(['featureToggle'], { key: 'redux' })
  );

  const store = createStore(rootReducer, /* preloadedState, */ enhancer);

  if (module.hot) {
    module.hot.accept('./reducers/index', () => {
      /* eslint-disable global-require */
      store.replaceReducer(require('./reducers/index').default);
    });
  }

  return store;
}
