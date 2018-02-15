import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Helptext from '../reg-form-helptext';
import CheckBoxFieldType from '../reg-form-field-checkbox-type';
import asyncValidate from '../../utils/asyncValidate';

let FormType = (props) => {
  const { helptextItems } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext title="Type" helptextItems={helptextItems.Dataset_type} />
        <Field
          name="type"
          component={CheckBoxFieldType}
        />
      </div>
    </form>
  )
}

FormType = reduxForm({
  form: 'type',
  asyncValidate,
  // asyncChangeFields: [],
})(FormType)

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      type: (dataset.result.type && dataset.result.type.length > 0) ? dataset.result.type : ''
    }
  }
)

export default connect(mapStateToProps)(FormType)
