import { reduxForm } from 'redux-form';

import { FormReference } from './form-reference.component';
import validate from './form-reference-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'reference',
  validate,
  asyncValidateDatasetInvokePatch
};

export const ConfiguredFormTitle = reduxForm(config)(FormReference);
