import { reduxForm } from 'redux-form';
import _throttle from 'lodash/throttle';
import { compose, withProps } from 'recompose';
import { FormDistributionApiPure } from './form-distribution-api-pure';
import { formDistributionApiResolver } from './form-distribution-api-resolver';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';
import { distributionTypes } from '../form-distribution/distribution-types';

export const setInitialValues = withProps(
  ({ datasetItem: { distribution } }) => ({
    initialValues: {
      distribution: distributionTypes(distribution)
    }
  })
);

export const formConfigurer = reduxForm({
  form: 'distribution',
  shouldAsyncValidate: () => true, // override default, save even if sync validation fails
  asyncValidate: _throttle(asyncValidateDatasetInvokePatch, 250)
});

const enhance = compose(
  setInitialValues,
  formConfigurer,
  formDistributionApiResolver
);

export const FormDistributionApi = enhance(FormDistributionApiPure);
