import _ from 'lodash';
import { reduxForm } from 'redux-form';

import { FormPublisher } from './form-publisher.component';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'publisher',
  shouldAsyncValidate: _.stubTrue, // override default, save even if sync validation fails
  asyncValidate: asyncValidateDatasetInvokePatch
};

export const ConfiguredFormPublisher = reduxForm(config)(FormPublisher);
