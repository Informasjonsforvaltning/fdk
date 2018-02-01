import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import CheckBoxFieldType from '../reg-form-field-checkbox-type';
import asyncValidate from '../../utils/asyncValidate';

const validate = values => {
  const errors = {}
  const title = (values.title && values.title.nb) ? values.title.nb : null;
  const description = (values.description && values.description.nb) ? values.description.nb : null;
  const objective = (values.objective && values.objective.nb) ? values.objective.nb : null;
  const landingPage = (values.landingPage && values.landingPage[0]) ? values.landingPage[0] : null;
  if (!title) {
    errors.title = {nb: localization.validation.required}
  } else if (title.length < 2) {
    errors.title = {nb: localization.validation.minTwoChars}
  }
  if (description && description.length < 2) {
    errors.description = {nb: localization.validation.minTwoChars}
  }
  if (objective && objective.length < 2) {
    errors.objective = {nb: localization.validation.minTwoChars}
  }
  if (landingPage && landingPage.length < 2) {
    errors.landingPage = [localization.validation.minTwoChars]
  }
  /*
   else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
   errors.email = 'Invalid email address'
   }
   */
  return errors
}

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
  validate,
  asyncValidate,
  //asyncChangeFields: [],
})(FormType)

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      type: (dataset.result.type && dataset.result.type.length > 0) ? dataset.result.type : ''
    }
  }
)

export default connect(mapStateToProps)(FormType)
