import { reduxForm } from 'redux-form';

import { FormSpatial } from './form-spatial.component';
import validate from './form-spatial-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'spatial',
  validate,
  asyncValidateDatasetInvokePatch
};

export const ConfiguredFormSpatial = reduxForm(config)(FormSpatial);
