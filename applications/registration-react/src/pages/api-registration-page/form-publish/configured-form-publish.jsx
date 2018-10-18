import { reduxForm } from 'redux-form';
import { FormPublish } from './form-publish';

import { asyncValidate } from '../async-patch/async-patch';
import shouldAsyncValidate from '../../../utils/shouldAsyncValidate';

// import validate from './form-title.validations';

const config = {
  form: 'apiMetaPublish',
  shouldAsyncValidate,
  asyncValidate
};

export const ConfiguredFormPublish = reduxForm(config)(FormPublish);
