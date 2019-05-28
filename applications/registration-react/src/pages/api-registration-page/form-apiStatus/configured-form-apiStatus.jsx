import _ from 'lodash';
import { reduxForm } from 'redux-form';
import { FormApiStatus } from './form-apiStatus.component';
import { asyncValidate } from '../async-patch/async-patch';
import { validate } from './form-apiStatus.validations';

const config = {
  form: 'apiStatus',
  validate,
  shouldAsyncValidate: _.stubTrue, // override default, save even if sync validation fails
  asyncValidate
};

export const ConfiguredFormApiStatus = reduxForm(config)(FormApiStatus);
