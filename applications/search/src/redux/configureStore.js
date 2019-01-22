import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import persistState from 'redux-localstorage';
import { apiMiddleware } from 'redux-api-middleware';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import { config } from '../config';
import { rootReducer } from './rootReducer';

function selectCompose() {
  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

export const history = createBrowserHistory();

export function configureStore() {
  const middlewares = [thunk, apiMiddleware, routerMiddleware(history)];
  if (config.reduxLog) {
    middlewares.push(createLogger());
  }

  const selectedCompose = selectCompose();

  const enhancer = selectedCompose(
    applyMiddleware(...middlewares),
    persistState(['featureToggle', 'settings'], { key: 'redux' })
  );

  const store = createStore(
    rootReducer(history),
    /* preloadedState, */ enhancer
  );
  store.dispatch({ type: 'STORE_INIT' });

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      /* eslint-disable global-require */
      store.replaceReducer(require('./rootReducer').rootReducer);
    });
  }

  return store;
}
