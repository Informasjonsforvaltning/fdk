import { reduxForm } from 'redux-form';
import { FormPublishPure } from '../../../components/form-publish/form-publish-pure.component';

import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'datasetPublish',
  asyncValidate: asyncValidateDatasetInvokePatch
};

export const ConfiguredFormPublish = reduxForm(config)(FormPublishPure);
