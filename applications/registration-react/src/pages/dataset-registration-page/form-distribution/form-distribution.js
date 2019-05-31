import { connect } from 'react-redux';
import { compose } from 'recompose';
import _ from 'lodash';
import { reduxForm } from 'redux-form';
import _throttle from 'lodash/throttle';

import { FormDistributionPure } from './form-distribution-pure';
import { distributionTypes } from './distribution-types';
import validate from './form-distribution-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem, openLicenseItems } = ownProps;
  return {
    initialValues: {
      distribution: distributionTypes(_.get(datasetItem, 'distribution')),
      openLicenseItems
    }
  };
};

const formConfigurer = reduxForm({
  form: 'distribution',
  validate,
  asyncValidate: _throttle(asyncValidateDatasetInvokePatch, 250)
});

const enhance = compose(
  connect(mapStateToProps),
  formConfigurer
);

export const FormDistribution = enhance(FormDistributionPure);
