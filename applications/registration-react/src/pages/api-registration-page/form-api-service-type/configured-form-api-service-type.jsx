import { reduxForm } from 'redux-form';
import { FormApiServiceType } from './form-api-service-type.component';
import { asyncValidate } from '../async-patch/async-patch';
import shouldAsyncValidate from '../../../lib/shouldAsyncValidate';

const config = {
  form: 'apiServiceType',
  shouldAsyncValidate,
  asyncValidate
};

export const ConfiguredFormApiServiceType = reduxForm(config)(
  FormApiServiceType
);
