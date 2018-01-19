import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import axios from 'axios';

import asyncValidate from './asyncValidate';

const validate = values => {
  const errors = {}

  const title = (values.title && values.title.nb) ? values.title.nb : null;

  console.log("validate", title);


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
  console.log(JSON.stringify(errors));
  return errors
}



const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label className="control-label">{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} className="form-control" />
      {touched && ((error && <span className="text-danger">{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
)

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
          component={renderField}
          label="First Name"/>
      </li>
    )}
  </ul>
)



let FormCode = props => {
  const { handleSubmit, pristine, submitting } = props;
  return (
    <form onSubmit={ handleSubmit }>
      <div className="form-group">
        <Field name="title.nb" component={renderField} label="First Name" />
      </div>
      <div className="form-group">
        <Field name="uri" component={renderField} label="Last Name" />
      </div>
      <div className="form-group">
        <Field name="email" component={renderField} label="Email" />
      </div>
      <FieldArray name="distribution" component={renderDistributions}/>
      <div className="form-group">
        <button type="submit" disabled={pristine || submitting} className="btn btn-primary">Submit</button>
      </div>
    </form>
  )
}
/*
FormCode = reduxForm({
  form: 'contact',
  validate,
})(FormCode);
*/

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
FormCode = reduxForm({
  form: 'contact',  // a unique identifier for this form,
  validate,
  asyncValidate,
  asyncBlurFields: [ 'title.nb', 'uri' ],
  asyncChangeFields: []
})(FormCode)

// You have to connect() to any reducers that you wish to connect to yourself
FormCode = connect(
  state => ({
    initialValues: state.dataset.result // pull initial values from account reducer
  }),
  { load: 'loadAccount' }               // bind account loading action creator
)(FormCode)

export default FormCode;


