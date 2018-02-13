import React from 'react';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import asyncValidate from '../../utils/asyncValidate';
import { informationModelType } from '../../schemaTypes';

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

const renderContactFields = (item, index, fields, props) => (
  <div className="d-flex mb-5" key={index}>
    <div className="w-50">
      <Field
        name={`${item}.prefLabel.nb`}
        component={InputField}
        label={props.titleLabel}
        showLabel
      />
    </div>
    <div className="w-50">
      <Field
        name={`${item}.uri`}
        component={InputField}
        label={props.linkLabel}
        showLabel
      />
    </div>
  </div>
);

const renderContact = (props) => {
  const { fields } = props;
  return (
    <div>
      {fields && fields.map((item, index) =>
        renderContactFields(item, index, fields, props)
      )}
    </div>
  );
};

let FormContact = (props) => {
  const { helptextItems } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext title="Kontaktpunkt" required helptextItems={helptextItems.ContactPoint_organizationalUnit} />
        <Field name="title.nb" component={InputField} label="Kontaktpunkt" />
      </div>
      <div className="form-group">
        <Helptext title="Kontaktskjema" required helptextItems={helptextItems.ContactPoint_hasURL} />
        <Field name="description.nb" component={InputField} label="Kontaktskjema" />
      </div>
      <div className="form-group">
        <Helptext title="E-post" helptextItems={helptextItems.Dataset_objective} />
        <Field name="objective.nb" component={InputField} label="E-post" />
      </div>
      <div className="form-group">
        <Helptext title="Telefon" helptextItems={helptextItems.Dataset_objective} />
        <Field name="objective.nb" component={InputField} label="Telefon" />
      </div>


    </form>
  )
}

FormContact = reduxForm({
  form: 'contact',
  validate,
  asyncValidate,
})(FormContact)

// Decorate with connect to read form values
const selector = formValueSelector('contact')
FormContact = connect(state => {
  const hasInformationModelUri = selector(state, 'informationModel.uri')
  return {
    hasInformationModelUri,
  }
})(FormContact)

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      informationModel: (dataset.result.informationModel && dataset.result.informationModel.length > 0) ? dataset.result.informationModel : [informationModelType],
    }
  }
)

export default connect(mapStateToProps)(FormContact)
