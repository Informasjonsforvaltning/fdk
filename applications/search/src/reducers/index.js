import { combineReducers } from 'redux';
import datasets from './datasets';
import terms from './terms';
import themes from './themes';
import routing from './routing';

const rootReducer = combineReducers({
  datasets,
  terms,
  themes,
  routing
});

export default rootReducer;
