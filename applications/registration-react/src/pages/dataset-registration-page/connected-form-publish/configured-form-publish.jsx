import { reduxForm } from 'redux-form';
import { FormPublish } from '../../../components/form-publish/form-publish.component';

import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';
import shouldAsyncValidate from '../../../lib/shouldAsyncValidate';

const config = {
  form: 'datasetPublish',
  shouldAsyncValidate,
  asyncValidateDatasetInvokePatch
};

export const ConfiguredFormPublish = reduxForm(config)(FormPublish);
