import { reduxForm } from 'redux-form';
import { FormApiStatus } from './form-apiStatus.component';
import { asyncValidate } from '../async-patch/async-patch';
import shouldAsyncValidate from '../../../lib/shouldAsyncValidate';

const config = {
  form: 'apiStatus',
  shouldAsyncValidate,
  asyncValidate
};

export const ConfiguredFormApiStatus = reduxForm(config)(FormApiStatus);
