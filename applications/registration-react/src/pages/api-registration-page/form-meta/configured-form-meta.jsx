import { reduxForm } from 'redux-form';
import { FormMeta } from './form-meta.component';
import { asyncValidate } from '../async-patch/async-patch';
import shouldAsyncValidate from '../../../utils/shouldAsyncValidate';

const config = {
  form: 'apiMeta',
  shouldAsyncValidate,
  asyncValidate,
  asyncChangeFields: []
};

export const ConfiguredFormMeta = reduxForm(config)(FormMeta);
