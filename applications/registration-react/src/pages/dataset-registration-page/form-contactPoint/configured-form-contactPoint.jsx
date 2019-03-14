import { reduxForm } from 'redux-form';

import { FormContactPoint } from './form-contactPoint.component';
import validate from './form-contactPoint-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'contactPoint',
  validate,
  asyncValidate: asyncValidateDatasetInvokePatch,
  asyncChangeFields: []
};

export const ConfiguredFormTitle = reduxForm(config)(FormContactPoint);
