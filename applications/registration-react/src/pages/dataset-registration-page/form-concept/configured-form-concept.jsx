import { reduxForm } from 'redux-form';

import { FormConcept } from './form-concept.component';
import validate from './form-concept-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'concept',
  validate,
  asyncValidateDatasetInvokePatch
};

export const ConfiguredFormConcept = reduxForm(config)(FormConcept);
