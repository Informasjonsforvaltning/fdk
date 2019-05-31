import { connect } from 'react-redux';
import { compose } from 'recompose';
import _ from 'lodash';

import { formConfigurer } from './form-configurer';
import { FormDistributionPure } from './form-distribution-pure';
import { distributionTypes } from './distribution-types';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem, openLicenseItems } = ownProps;
  return {
    initialValues: {
      distribution: distributionTypes(_.get(datasetItem, 'distribution')),
      openLicenseItems
    }
  };
};

const enhance = compose(
  connect(mapStateToProps),
  formConfigurer
);

export const FormDistribution = enhance(FormDistributionPure);
