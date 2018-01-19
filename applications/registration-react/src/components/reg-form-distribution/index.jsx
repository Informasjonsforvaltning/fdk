import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Card } from 'reactstrap';
import { connect } from 'react-redux'
import axios from 'axios';

import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import InputTagsField from '../reg-form-field-input-tags';
import TextAreaField from '../reg-form-field-textarea';
import RadioField from '../reg-form-field-radio';
import asyncValidate from '../dataset-redux-form-title/asyncValidate';

const validate = values => {
  console.log("validate");
  const errors = {}
  const title = (values.title && values.title.nb) ? values.title.nb : null;

  if (!title) {
    errors.title = {nb: 'Required'}
  } else if (title.length < 2) {
    errors.title = {nb: 'Minimum be 2 characters or more'}
  }
  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (!values.uri) {
    errors.uri = 'Required'
  } else if (values.uri.length < 2) {
    errors.uri = 'Minimum be 2 characters or more'
  }
  return errors
}

const renderDistributions = ({ fields, meta: { touched, error, submitFailed } }, helptextItems, onChange) => {

  return (
    <div>
      {fields.map((distribution, index) =>
        <div key={index}>
          <div className="d-flex">
            <h4>Distribusjon #{index + 1}</h4>
            <button
              type="button"
              title="Remove Member"
              onClick={() => fields.remove(index)}>
              <i className="fa fa-trash mr-2" />
              Slett distribusjon
            </button>
          </div>
          <div className="form-group">
            <Helptext helptextItems={helptextItems.Dataset_distribution} />
            <Field name={`${distribution}.type`} component={RadioField} type="radio" value="API" />
            <Field name={`${distribution}.type`} component={RadioField} type="radio" value="Feed" />
            <Field name={`${distribution}.type`} component={RadioField} type="radio" value="Nedlastbar fil" />
          </div>
          <div className="form-group">
            <Helptext title="Tilgangs URL" helptextItems={helptextItems.Distribution_accessURL} />
            <Field
              name={`${distribution}.accessURL`}
              type="text"
              component={InputField}
              label="Tilgangs URL"/>
          </div>
          <div className="form-group">
            <Helptext title="Tilgangs URL" helptextItems={helptextItems.Distribution_accessURL} />
            <Field
              name={`${distribution}.format`}
              type="text"
              component={InputTagsField}
              label="Format"
            />
          </div>
          <div className="form-group">
            <Helptext title="Lisens" helptextItems={helptextItems.Distribution_modified} />
            <Field name={`${distribution}.license.uri`} component={InputField} label="Lisens" />
          </div>
          <div className="form-group">
            <Helptext title="Beskrivelse" helptextItems={helptextItems.Distribution_description} />
            <Field name={`${distribution}.description.nb`} component={TextAreaField} label="Beskrivelse" />
          </div>

          <div className="form-group">
            <Helptext
              title="Lenke til dokumentasjon av distribusjonen"
              helptextItems={helptextItems.Distribution_documentation}
            />
            <Field name={`${distribution}.page[0].uri`} component={InputField} label="Lisens" />
          </div>

          <div className="form-group">
            <Helptext
              helptextItems={helptextItems.Distribution_conformsTo}
            />
            <div className="d-flex">
              <div className="w-50">
              <Field name={`${distribution}.conformsTo[0].prefLabel.nb`} component={InputField} label="Tittel på standard" />
              </div>
              <div className="w-50">
              <Field name={`${distribution}.conformsTo[0].uri`} component={InputField} label="Lenke til standard" />
              </div>
            </div>
          </div>
          <hr />
        </div>
      )}
      <button type="button" onClick={() => fields.push({})}>
        <i className="fa fa-plus mr-2" />
        Legg til distribusjon
      </button>
    </div>
  );
}

let FormDistribution = props => {
  const { handleSubmit, pristine, submitting, helptextItems, onChange } = props;
  return (
    <form onSubmit={ handleSubmit }>
      <FieldArray name="distribution" component={(props) => (renderDistributions(props, helptextItems, onChange))}/>
    </form>
  )
}


const onChange = (values) => {
  //console.log("onChange funksjon", JSON.stringify(values));
}


// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
FormDistribution = reduxForm({
  form: 'distribution',  // a unique identifier for this form,
  validate,
  asyncValidate,
  //asyncBlurFields: [ ],
  asyncChangeFields: [],
  onChange: onChange
})(FormDistribution)

// You have to connect() to any reducers that you wish to connect to yourself
FormDistribution = connect(
  state => ({
    initialValues: state.dataset.result // pull initial values from dataset reducer
  })
)(FormDistribution)

export default FormDistribution;
