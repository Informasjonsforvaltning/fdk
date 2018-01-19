import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import api from '../middleware/api';
import rootReducer from '../reducers';

const createStoreWithMiddlewares = applyMiddleware(thunk, api)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddlewares(rootReducer, initialState);
}
