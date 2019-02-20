import { reduxForm } from 'redux-form';
import { FormPublish } from '../../../components/form-publish/form-publish.component';

import { asyncValidate } from '../async-patch/async-patch';
import shouldAsyncValidate from '../../../lib/shouldAsyncValidate';

const config = {
  form: 'apiMetaPublish',
  shouldAsyncValidate,
  asyncValidate
};

export const ConfiguredFormPublish = reduxForm(config)(FormPublish);
