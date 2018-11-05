import { reduxForm } from 'redux-form';

import { FormThemes } from './form-theme.component';
import validate from './form-theme-validations';
import asyncValidate from '../../../utils/asyncValidate';

const config = {
  form: 'themes',
  validate,
  asyncValidate
};

export const ConfiguredFormThemes = reduxForm(config)(FormThemes);
