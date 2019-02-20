import { reduxForm } from 'redux-form';

import { FormTitle } from './form-title.component';
import validate from './form-title.validations';
import asyncValidate from '../../../lib/asyncValidate';
import shouldAsyncValidate from '../../../lib/shouldAsyncValidate';

const config = {
  form: 'title',
  validate,
  shouldAsyncValidate,
  asyncValidate,
  asyncChangeFields: []
};

export const ConfiguredFormTitle = reduxForm(config)(FormTitle);
