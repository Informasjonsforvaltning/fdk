import { reduxForm } from 'redux-form';

import { FormThemes } from './form-theme.component';
import validate from './form-theme-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'themes',
  validate,
  asyncValidateDatasetInvokePatch
};

export const ConfiguredFormThemes = reduxForm(config)(FormThemes);
