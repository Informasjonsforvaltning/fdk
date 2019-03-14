import { reduxForm } from 'redux-form';

import { FormType } from './form-type.component';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'type',
  asyncValidateDatasetInvokePatch
};

export const ConfiguredFormType = reduxForm(config)(FormType);
