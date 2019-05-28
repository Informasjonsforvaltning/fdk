import { reduxForm } from 'redux-form';
import { FormPublish } from '../../../components/form-publish/form-publish.component';

import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'datasetPublish',
  asyncValidate: asyncValidateDatasetInvokePatch
};

export const ConfiguredFormPublish = reduxForm(config)(FormPublish);
