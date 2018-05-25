import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import api from '../middleware/api';
import rootReducer from '../reducers/index';

export default function configureStore() {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    /* preloadedState, */ composeEnhancers(
      applyMiddleware(thunk, api, createLogger())
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      /* eslint-disable global-require */
      store.replaceReducer(require('../reducers').default);
    });
  }
  return store;
}
