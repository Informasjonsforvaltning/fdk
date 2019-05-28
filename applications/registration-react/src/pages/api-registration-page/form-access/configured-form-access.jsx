import { reduxForm } from 'redux-form';
import { FormAccess } from './form-access.component';
import { asyncValidate } from '../async-patch/async-patch';

const config = {
  form: 'apiAccess',
  asyncValidate
};

export const ConfiguredFormAccess = reduxForm(config)(FormAccess);
