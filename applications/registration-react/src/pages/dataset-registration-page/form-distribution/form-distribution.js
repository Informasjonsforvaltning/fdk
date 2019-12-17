import { compose, withProps } from 'recompose';
import { reduxForm } from 'redux-form';
import _throttle from 'lodash/throttle';

import { FormDistributionPure } from './form-distribution-pure';
import { distributionTypes } from './distribution-types';
import validate from './form-distribution-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const setInitialValues = withProps(({ datasetItem: { distribution } }) => ({
  initialValues: {
    distribution: distributionTypes(distribution)
  }
}));

const formConfigurer = reduxForm({
  form: 'distribution',
  validate,
  shouldAsyncValidate: () => true, // override default, save even if sync validation fails
  asyncValidate: _throttle(asyncValidateDatasetInvokePatch, 250)
});

const enhance = compose(setInitialValues, formConfigurer);

export const FormDistribution = enhance(FormDistributionPure);
