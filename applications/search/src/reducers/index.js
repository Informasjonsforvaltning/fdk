import { combineReducers } from 'redux';
import datasets from './datasets';
import terms from './terms';
import themes from './themes';

const rootReducer = combineReducers({
  datasets,
  terms,
  themes
});

export default rootReducer;
