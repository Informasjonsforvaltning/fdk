import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import dataset from './dataset';
import helptexts from './helptexts';

const rootReducer = combineReducers({
  form: formReducer,
  dataset,
  helptexts
});

export default rootReducer;
