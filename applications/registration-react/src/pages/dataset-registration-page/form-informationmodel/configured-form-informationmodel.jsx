import { reduxForm } from 'redux-form';

import { FormInformationModel } from './form-informationmodel.component';
import validate from './form-informationmodel-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'informationModel',
  validate,
  asyncValidate: asyncValidateDatasetInvokePatch
};

export const ConfiguredFormInformationModel = reduxForm(config)(
  FormInformationModel
);
