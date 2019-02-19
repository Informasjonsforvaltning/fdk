import { reduxForm } from 'redux-form';
import { FormAccess } from './form-access.component';
import { asyncValidate } from '../async-patch/async-patch';
import shouldAsyncValidate from '../../../utils/shouldAsyncValidate';

const config = {
  form: 'apiAccess',
  shouldAsyncValidate,
  asyncValidate
};

export const ConfiguredFormAccess = reduxForm(config)(FormAccess);
