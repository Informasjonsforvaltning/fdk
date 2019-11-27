import { reduxForm } from 'redux-form';
import { FormPublishPure } from '../../../components/form-publish/form-publish-pure.component';

import { asyncValidate } from '../async-patch/async-patch';

const config = {
  form: 'apiMetaPublish',
  asyncValidate
};

export const ConfiguredFormPublish = reduxForm(config)(FormPublishPure);
