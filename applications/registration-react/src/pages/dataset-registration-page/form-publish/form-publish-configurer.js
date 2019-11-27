import { reduxForm } from 'redux-form';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

export const formPublishConfigurer = reduxForm({
  form: 'datasetPublish',
  asyncValidate: asyncValidateDatasetInvokePatch
});
