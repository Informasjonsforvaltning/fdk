import { reduxForm } from 'redux-form';

import { FormSpatial } from './form-spatial.component';
import validate from './form-spatial-validations';
import asyncValidate from '../../../lib/asyncValidate';

const config = {
  form: 'spatial',
  validate,
  asyncValidate
};

export const ConfiguredFormSpatial = reduxForm(config)(FormSpatial);
