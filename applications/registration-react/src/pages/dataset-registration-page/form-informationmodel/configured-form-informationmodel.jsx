import { reduxForm } from 'redux-form';

import { FormInformationModel } from './form-informationmodel.component';
import validate from './form-informationmodel-validations';
import asyncValidate from '../../../utils/asyncValidate';

const config = {
  form: 'informationModel',
  validate,
  asyncValidate,
  asyncChangeFields: []
};

export const ConfiguredFormInformationModel = reduxForm(config)(
  FormInformationModel
);
