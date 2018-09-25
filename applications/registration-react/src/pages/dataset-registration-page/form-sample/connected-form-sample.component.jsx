import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _throttle from 'lodash/throttle';

import Form from './form-sample.component';
import validate from './form-sample-validations';
import asyncValidate from '../../../utils/asyncValidate';
import { textType, licenseType } from '../../../schemaTypes';

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
const FormSample = reduxForm({
  form: 'sample',
  validate,
  asyncValidate: _throttle(asyncValidate, 250)
})(Form);

export const sampleTypes = values => {
  let samples = null;
  if (values && values.length > 0) {
    samples = values.map(item => ({
      id: item.id ? item.id : '',
      description: item.description ? item.description : textType,
      accessURL: item.accessURL ? item.accessURL : [],
      license: item.license ? item.license : licenseType,
      conformsTo: item.conformsTo ? item.conformsTo : [],
      page: item.page && item.page.length > 0 ? item.page : [{}],
      format: item.format ? item.format : [],
      type: item.type ? item.type : ''
    }));
  } else {
    samples = [];
  }
  return samples;
};

const mapStateToProps = ({ dataset, openlicenses }) => ({
  initialValues: {
    sample: sampleTypes(dataset.result.sample) || [{}],
    openLicenseItems: openlicenses.openLicenseItems
  }
});

export default connect(mapStateToProps)(FormSample);
