import { reduxForm } from 'redux-form';

import { FormContentsComponent } from './form-contents.component';
import validate from './form-contents-validations';
import asyncValidate from '../../../utils/asyncValidate';

const config = {
  form: 'contents',
  validate,
  asyncValidate,
  asyncChangeFields: []
};

export const ConfiguredFormTitle = reduxForm(config)(FormContentsComponent);
