import { reduxForm } from 'redux-form';
import { FormApiServiceType } from './form-api-service-type.component';
import { asyncValidate } from '../async-patch/async-patch';

const config = {
  form: 'apiServiceType',
  asyncValidate
};

export const ConfiguredFormApiServiceType = reduxForm(config)(
  FormApiServiceType
);
