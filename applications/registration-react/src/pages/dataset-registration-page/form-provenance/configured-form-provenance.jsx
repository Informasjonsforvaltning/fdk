import { reduxForm } from 'redux-form';
import _throttle from 'lodash/throttle';

import { FormProvenance } from './form-provenance.component';
import validate from './form-provenance-validations';
import asyncValidate from '../../../lib/asyncValidate';

const config = {
  form: 'provenance',
  validate,
  asyncValidate: _throttle(asyncValidate, 250)
};

export const ConfiguredFormProvenance = reduxForm(config)(FormProvenance);
