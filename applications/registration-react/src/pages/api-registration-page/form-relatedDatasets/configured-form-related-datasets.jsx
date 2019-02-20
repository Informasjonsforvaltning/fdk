import { reduxForm } from 'redux-form';
import { FormRelatedDatasets } from './form-related-datasets.component';
import { asyncValidate } from '../async-patch/async-patch';
import shouldAsyncValidate from '../../../lib/shouldAsyncValidate';

const config = {
  form: 'apiDatasetReferences',
  shouldAsyncValidate,
  asyncValidate
};

export const ConfiguredFormRelatedDatasets = reduxForm(config)(
  FormRelatedDatasets
);
