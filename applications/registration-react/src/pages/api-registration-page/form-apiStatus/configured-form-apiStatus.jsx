import { reduxForm } from 'redux-form';
import { FormApiStatus } from './form-apiStatus.component';
import { asyncValidate } from '../async-patch/async-patch';
import shouldAsyncValidate from '../../../lib/shouldAsyncValidate';
import { validate } from './form-apiStatus.validations';

const config = {
  form: 'apiStatus',
  shouldAsyncValidate,
  validate,
  asyncValidate
};

export const ConfiguredFormApiStatus = reduxForm(config)(FormApiStatus);
