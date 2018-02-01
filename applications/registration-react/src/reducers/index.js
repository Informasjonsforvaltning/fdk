import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import dataset from './dataset';
import helptexts from './helptexts';
import provenance from './provenance';
import frequency from './frequency';
import themes from './themes';
import user from './user';
import app from './app';

const rootReducer = combineReducers({
  form: formReducer,
  app,
  dataset,
  helptexts,
  provenance,
  frequency,
  themes,
  user
});

export default rootReducer;
