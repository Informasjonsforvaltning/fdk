import React from 'react';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import asyncValidate from '../../utils/asyncValidate';
import { contactPointType } from '../../schemaTypes';
import { validateMinTwoChars, validateURL, validateEmail, validatePhone } from '../../validation/validation';

const validate = values => {
  const errors = {}
  const { contactPoint } = values;
  let contactPointNodes = null;
  if (contactPoint) {
    contactPointNodes = contactPoint.map(item => {
      let itemErrors = {}
      itemErrors = validateMinTwoChars('organizationUnit', item.organizationUnit, itemErrors, null, false);
      itemErrors = validateURL('hasURL', item.hasURL, itemErrors);
      itemErrors = validateEmail('email', item.email, itemErrors);
      itemErrors = validatePhone('hasTelephone', item.hasTelephone, itemErrors);
      return itemErrors;
    });
    let showSyncError = false;
    contactPointNodes.map(item => {
      if (JSON.stringify(item) !== '{}') {
        showSyncError = true;
      }
    });
    if (showSyncError) {
      errors.contactPoint = contactPointNodes;
    }
  }
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
        <div className="w-50">
          <Field name="contactPoint[0].hasTelephone" component={InputField} label="Telefon" />
        </div>
      </div>
    </form>
  )
}

FormContactPoint = reduxForm({
  form: 'contactPoint',
  validate,
  asyncValidate,
  asyncChangeFields: [],
})(FormContactPoint)


const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      contactPoint: (dataset.result.contactPoint && dataset.result.contactPoint.length > 0) ? dataset.result.contactPoint : [contactPointType],
    }
  }

)

export default connect(mapStateToProps)(FormContactPoint)
