import { reduxForm } from 'redux-form';
import { FormPublish } from '../../../components/form-publish/form-publish.component';

import asyncValidate from '../../../lib/asyncValidate';
import shouldAsyncValidate from '../../../lib/shouldAsyncValidate';

const config = {
  form: 'datasetPublish',
  shouldAsyncValidate,
  asyncValidate
};

export const ConfiguredFormPublish = reduxForm(config)(FormPublish);
