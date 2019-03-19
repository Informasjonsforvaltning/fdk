import { reduxForm } from 'redux-form';
import _throttle from 'lodash/throttle';

import { FormSample } from './form-sample.component';
import validate from './form-sample-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'sample',
  validate,
  asyncValidate: _throttle(asyncValidateDatasetInvokePatch, 250)
};

export const ConfiguredFormSample = reduxForm(config)(FormSample);
