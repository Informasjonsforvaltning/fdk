import React from 'react';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import asyncValidate from '../../utils/asyncValidate';
import { contactPointType } from '../../schemaTypes';

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


let FormContactPoint = (props) => {
  const { helptextItems } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext title="Kontaktpunkt" helptextItems={"plassholder for hjelpetekst kontaktpunkt"} />
        <Field name="contactPoint[0].organizationUnit" component={InputField} label="Kontaktpunkt" />
      </div>
      <div className="form-group">
        <Helptext title="Kontaktskjema" helptextItems={helptextItems.ContactPoint_hasURL} />
        <Field name="contactPoint[0].hasURL" component={InputField} label="Kontaktskjema" />
      </div>
      <div className="form-group">
        <Helptext title="E-post" helptextItems={helptextItems.ContactPoint_hasEmail} />
        <Field name="contactPoint[0].email" component={InputField} label="E-post" />
      </div>
      <div className="form-group">
        <Helptext title="Telefon" helptextItems={helptextItems.ContactPoint_hasTelephone} />
        <Field name="contactPoint[0].hasTelephone" component={InputField} label="Telefon" />
      </div>
    </form>
  )
}

FormContactPoint = reduxForm({
  form: 'contactPoint[0]',
  validate,
  asyncValidate,
  asyncChangeFields: [],
})(FormContactPoint)


const mapStateToProps = ({ dataset }) => (
  {
    initalValues: {
      contactPoint: (dataset.result.contactPoint && dataset.result.contactPoint.length > 0) ? dataset.result.contactPoint : []
    }
  }
)

export default connect(mapStateToProps)(FormContactPoint)
