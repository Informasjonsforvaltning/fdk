import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Form from './form-contactPoint.component';
import validate from './form-contactPoint-validations';
import asyncValidate from '../../../utils/asyncValidate';
import { contactPointType } from '../../../schemaTypes';

const FormContactPoint = reduxForm({
  form: 'contactPoint',
  validate,
  asyncValidate,
  asyncChangeFields: []
})(Form);

const mapStateToProps = ({ dataset }) => ({
  initialValues: {
    contactPoint:
      dataset.result.contactPoint && dataset.result.contactPoint.length > 0
        ? dataset.result.contactPoint
        : [contactPointType]
  }
});

export default connect(mapStateToProps)(FormContactPoint);
