import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import axios from 'axios';

import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import TextAreaField from '../reg-form-field-textarea';
import asyncValidate from '../dataset-redux-form-title/asyncValidate';

const validate = values => {
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

const renderDistributions = ({ fields, meta: { touched, error, submitFailed } }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}>Add Distribution</button>
      {(touched || submitFailed) && error && <span>{error}</span>}
    </li>
    {fields.map((distribution, index) =>
      <li key={index}>
        <button
          type="button"
          title="Remove Member"
          onClick={() => fields.remove(index)}/>
        <h4>Distribution #{index + 1}</h4>
        <Field
          name={`${distribution}.id`}
          type="text"
          component={InputField}
          label="First Name"/>
      </li>
    )}
  </ul>
)

let FormTitle = props => {
  const { handleSubmit, pristine, submitting, helptextItems } = props;
  //console.log(JSON.stringify(props.initialValues));
  return (
    <form onSubmit={ handleSubmit }>
      <div className="form-group">
        <Helptext title="Tittel" required helptextItems={helptextItems.Distribution_modified} />
        <Field name="title.nb" component={InputField} label="Tittel" />
      </div>
      <div className="form-group">
        <Helptext title="Beskrivelse av datasettet" required helptextItems={helptextItems.Dataset_description} />
        <Field name="description.nb" component={TextAreaField} label="Beskrivelse" />
      </div>
      <div className="form-group">
        <Helptext title="Formålet med datasettet" helptextItems={helptextItems.Dataset_objective}/>
        <Field name="objective.nb" component={TextAreaField} label="Formål" />
      </div>
      <div className="form-group">
        <Helptext title="Lenke til mer informasjon om datasettet" helptextItems={helptextItems.Dataset_landingpage}/>
        <Field name="landingPage" component={InputField} label="Lenke til mer" />
      </div>
      <div className="form-group">
        <button type="submit" disabled={pristine || submitting} className="btn btn-primary">Submit</button>
      </div>
    </form>
  )
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
FormTitle = reduxForm({
  form: 'title',  // a unique identifier for this form,
  validate,
  asyncValidate,
  //asyncBlurFields: [ 'title.nb', 'description.nb', 'objective.nb', 'landingPage'],
  //asyncBlurFields: [],
  asyncChangeFields: []
})(FormTitle)

// You have to connect() to any reducers that you wish to connect to yourself
FormTitle = connect(
  state => ({
    initialValues: state.dataset.result // pull initial values from dataset reducer
  })
)(FormTitle)

export default FormTitle;
