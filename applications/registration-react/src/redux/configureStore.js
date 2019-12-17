import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './rootReducer';
import { getConfig } from '../config';

export function configureStore() {
  const middlewares = [thunk];

  if (getConfig().store.useLogger) {
    middlewares.push(createLogger());
  }

  const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

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
