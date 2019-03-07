import { reduxForm } from 'redux-form';
import _throttle from 'lodash/throttle';

import { FormDistributionAPI } from './form-distribution-api';
import asyncValidate from '../../../lib/asyncValidate';

const config = {
  form: 'distribution',
  asyncValidate: _throttle(asyncValidate, 250)
};

export const ConfiguredFormDistributionAPI = reduxForm(config)(
  FormDistributionAPI
);
