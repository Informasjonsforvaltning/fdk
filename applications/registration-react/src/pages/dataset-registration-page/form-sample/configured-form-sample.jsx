import { reduxForm } from 'redux-form';
import _throttle from 'lodash/throttle';

import { FormSample } from './form-sample.component';
import validate from './form-sample-validations';
import asyncValidate from '../../../lib/asyncValidate';

const config = {
  form: 'sample',
  validate,
  asyncValidate: _throttle(asyncValidate, 250)
};

export const ConfiguredFormSample = reduxForm(config)(FormSample);
