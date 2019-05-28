import { reduxForm } from 'redux-form';
import { FormRelatedDatasets } from './form-related-datasets.component';
import { asyncValidate } from '../async-patch/async-patch';

const config = {
  form: 'apiDatasetReferences',
  asyncValidate
};

export const ConfiguredFormRelatedDatasets = reduxForm(config)(
  FormRelatedDatasets
);
