import _ from 'lodash';
import { reduxForm } from 'redux-form';

import { FormTitle } from './form-title.component';
import validate from './form-title.validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'title',
  validate,
  shouldAsyncValidate: _.stubTrue, // override default, save even if sync validation fails
  asyncValidate: asyncValidateDatasetInvokePatch
};

export const ConfiguredFormTitle = reduxForm(config)(FormTitle);
