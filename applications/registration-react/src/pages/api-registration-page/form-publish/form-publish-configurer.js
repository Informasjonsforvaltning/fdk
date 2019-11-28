import { reduxForm } from 'redux-form';
import { asyncValidate } from '../async-patch/async-patch';

export const formPublishConfigurer = reduxForm({
  form: 'apiMetaPublish',
  asyncValidate
});
