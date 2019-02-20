import { reduxForm } from 'redux-form';
import _throttle from 'lodash/throttle';

import { FormDistribution } from './form-distribution.component';
import validate from './form-distribution-validations';
import asyncValidate from '../../../lib/asyncValidate';

const config = {
  form: 'distribution',
  validate,
  asyncValidate: _throttle(asyncValidate, 250)
};

export const ConfiguredFormDistribution = reduxForm(config)(FormDistribution);
