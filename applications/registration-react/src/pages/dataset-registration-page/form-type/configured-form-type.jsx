import { reduxForm } from 'redux-form';

import { FormType } from './form-type.component';
import asyncValidate from '../../../lib/asyncValidate';

const config = {
  form: 'type',
  asyncValidate
};

export const ConfiguredFormType = reduxForm(config)(FormType);
