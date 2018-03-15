import { combineReducers } from 'redux';
import datasets from './datasets';
import terms from './terms';
import themes from './themes';
import publishers from './publishers';

const rootReducer = combineReducers({
  datasets,
  terms,
  themes,
  publishers
});

export default rootReducer;
