import { reduxForm } from 'redux-form';
import { FormMeta } from './form-meta.component';
import { asyncValidate } from '../async-patch/async-patch';

const config = {
  form: 'apiMeta',
  asyncValidate
};

export const ConfiguredFormMeta = reduxForm(config)(FormMeta);
