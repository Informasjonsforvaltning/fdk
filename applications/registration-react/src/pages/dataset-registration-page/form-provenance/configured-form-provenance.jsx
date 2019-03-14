import { reduxForm } from 'redux-form';
import _throttle from 'lodash/throttle';

import { FormProvenance } from './form-provenance.component';
import validate from './form-provenance-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'provenance',
  validate,
  asyncValidate: _throttle(asyncValidateDatasetInvokePatch, 250)
};

export const ConfiguredFormProvenance = reduxForm(config)(FormProvenance);
