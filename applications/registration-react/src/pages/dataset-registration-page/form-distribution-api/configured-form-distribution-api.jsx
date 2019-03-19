import { reduxForm } from 'redux-form';
import _throttle from 'lodash/throttle';

import { FormDistributionAPI } from './form-distribution-api';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'distribution',
  asyncValidate: _throttle(asyncValidateDatasetInvokePatch, 250)
};

export const ConfiguredFormDistributionAPI = reduxForm(config)(
  FormDistributionAPI
);
