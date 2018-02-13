import React from 'react';
import { Field, reduxForm, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

import Helptext from '../reg-form-helptext';
import CheckBoxFieldType from '../reg-form-field-checkbox-type';
import asyncValidate from '../../utils/asyncValidate';
import { validateRequired} from '../../validation/validation';

const validate = values => {
  let errors = {}
  const { type } = values;

  errors = validateRequired('errorType', type, errors, false);

  return errors
}

let FormType = (props) => {
  const { syncErrors: { errorType }, helptextItems } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext title="Type" helptextItems={helptextItems.Dataset_type} />
        <Field
          name="type"
          component={CheckBoxFieldType}
        />
        {errorType &&
        <div className="alert alert-danger mt-3">{errorType}</div>
        }
      </div>
    </form>
  )
}

FormType = reduxForm({
  form: 'type',
  validate,
  asyncValidate,
})(connect(state => ({
  syncErrors: getFormSyncErrors("type")(state)
}))(FormType));

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      type: (dataset.result.type && dataset.result.type.length > 0) ? dataset.result.type : ''
    }
  }
)

export default connect(mapStateToProps)(FormType)
