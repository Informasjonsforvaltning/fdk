import { reduxForm } from 'redux-form';

import { FormTitle } from './form-title.component';
import validate from './form-title.validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';
import shouldAsyncValidate from '../../../lib/shouldAsyncValidate';

const config = {
  form: 'title',
  validate,
  shouldAsyncValidate,
  asyncValidateDatasetInvokePatch,
  asyncChangeFields: []
};

export const ConfiguredFormTitle = reduxForm(config)(FormTitle);
