import { reduxForm } from 'redux-form';

import { FormConceptPure } from './form-concept-pure.component';
import validate from './form-concept-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'concept',
  validate,
  asyncValidate: asyncValidateDatasetInvokePatch
};

export const ConfiguredFormConcept = reduxForm(config)(FormConceptPure);
