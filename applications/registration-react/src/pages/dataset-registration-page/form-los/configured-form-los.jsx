import { reduxForm } from 'redux-form';

import { FormLOS } from './form-los.component';
import validate from '../form-theme/form-theme-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'themes',
  validate,
  asyncValidate: asyncValidateDatasetInvokePatch
};

export const ConfiguredFormLOS = reduxForm(config)(FormLOS);
