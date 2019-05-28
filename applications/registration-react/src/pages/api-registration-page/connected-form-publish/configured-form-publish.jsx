import { reduxForm } from 'redux-form';
import { FormPublish } from '../../../components/form-publish/form-publish.component';

import { asyncValidate } from '../async-patch/async-patch';

const config = {
  form: 'apiMetaPublish',
  asyncValidate
};

export const ConfiguredFormPublish = reduxForm(config)(FormPublish);
