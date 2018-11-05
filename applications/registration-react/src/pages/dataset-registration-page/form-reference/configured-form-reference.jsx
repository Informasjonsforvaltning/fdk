import { reduxForm } from 'redux-form';

import { FormReference } from './form-reference.component';
import validate from './form-reference-validations';
import asyncValidate from '../../../utils/asyncValidate';

const config = {
  form: 'reference',
  validate,
  asyncValidate
};

export const ConfiguredFormTitle = reduxForm(config)(FormReference);
