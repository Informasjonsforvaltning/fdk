import { reduxForm } from 'redux-form';

import { FormTitle } from './form-title.component';
import validate from './form-title.validations';
import asyncValidate from '../../../utils/asyncValidate';
import shouldAsyncValidate from '../../../utils/shouldAsyncValidate';

const config = {
  form: 'title',
  validate,
  shouldAsyncValidate,
  asyncValidate,
  asyncChangeFields: []
};

export const ConfiguredFormTitle = reduxForm(config)(FormTitle);
