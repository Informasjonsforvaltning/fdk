import { reduxForm } from 'redux-form';
import _throttle from 'lodash/throttle';

import { FormDistributionPure } from './form-distribution-pure';
import validate from './form-distribution-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'distribution',
  validate,
  asyncValidate: _throttle(asyncValidateDatasetInvokePatch, 250)
};

export const ConfiguredFormDistribution = reduxForm(config)(
  FormDistributionPure
);
