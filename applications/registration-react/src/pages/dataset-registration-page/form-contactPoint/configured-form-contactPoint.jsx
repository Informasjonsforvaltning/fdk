import { reduxForm } from 'redux-form';

import { FormContactPoint } from './form-contactPoint.component';
import validate from './form-contactPoint-validations';
import asyncValidate from '../../../lib/asyncValidate';

const config = {
  form: 'contactPoint',
  validate,
  asyncValidate,
  asyncChangeFields: []
};

export const ConfiguredFormTitle = reduxForm(config)(FormContactPoint);
