import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _throttle from 'lodash/throttle';

import Form from './form-distribution.component';
import validate from './form-distribution-validations';
import asyncValidate from '../../../utils/asyncValidate';
import { textType, licenseType } from '../../../schemaTypes';

const FormDistribution = reduxForm({
  form: 'distribution',
  validate,
  asyncValidate: _throttle(asyncValidate, 250)
})(Form);

export const distributionTypes = values => {
  let distributions = null;
  if (values && values.length > 0) {
    distributions = values.map(item => ({
      id: item.id ? item.id : '',
      description: item.description ? item.description : textType,
      accessURL: item.accessURL ? item.accessURL : [],
      license: item.license ? item.license : licenseType,
      conformsTo: item.conformsTo ? item.conformsTo : [],
      page: item.page && item.page.length > 0 ? item.page : [licenseType],
      format: item.format ? item.format : [],
      type: item.type ? item.type : ''
    }));
  } else {
    distributions = [];
  }
  return distributions;
};

const mapStateToProps = ({ dataset, openlicenses }) => ({
  initialValues: {
    distribution: distributionTypes(dataset.result.distribution),
    openLicenseItems: openlicenses.openLicenseItems
  }
});

export default connect(mapStateToProps)(FormDistribution);
