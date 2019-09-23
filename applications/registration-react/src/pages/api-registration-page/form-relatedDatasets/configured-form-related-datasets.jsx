import { reduxForm } from 'redux-form';
import { FormRelatedDatasetsPure } from './form-related-datasets-pure';
import { asyncValidate } from '../async-patch/async-patch';

const config = {
  form: 'apiDatasetReferences',
  asyncValidate
};

export const ConfiguredFormRelatedDatasets = reduxForm(config)(
  FormRelatedDatasetsPure
);
