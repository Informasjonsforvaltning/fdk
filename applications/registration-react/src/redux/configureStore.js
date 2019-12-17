import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import persistState from 'redux-localstorage';

import rootReducer from './rootReducer';
import { getConfig } from '../config';

function selectCompose() {
  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

export function configureStore() {
  const middlewares = [thunk];

  if (getConfig().store.useLogger) {
    middlewares.push(createLogger());
  }

  const selectedCompose = selectCompose();

  const enhancer = selectedCompose(
    applyMiddleware(...middlewares),
    persistState(['featureToggle'], { key: 'redux' })
  );

  const store = createStore(rootReducer, /* preloadedState, */ enhancer);
  store.dispatch({ type: 'STORE_INIT' });

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      /* eslint-disable-next-line global-require */
      store.replaceReducer(require('./rootReducer').rootReducer);
    });
  }

  return store;
}
