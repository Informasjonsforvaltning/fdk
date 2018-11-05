import { reduxForm } from 'redux-form';

import { FormConcept } from './form-concept.component';
import validate from './form-concept-validations';
import asyncValidate from '../../../utils/asyncValidate';

const config = {
  form: 'concept',
  validate,
  asyncValidate
};

export const ConfiguredFormConcept = reduxForm(config)(FormConcept);
