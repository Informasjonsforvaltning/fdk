import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux'

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import TextAreaField from '../reg-form-field-textarea';
import asyncValidate from '../../utils/asyncValidate';

const validate = values => {
  console.log("VALIDATE");
  const errors = {}
  const title = (values.title && values.title.nb) ? values.title.nb : null;
  const description = (values.description && values.description.nb) ? values.description.nb : null;
  const objective = (values.objective && values.objective.nb) ? values.objective.nb : null;
  const landingPage = (values.landingPage && values.landingPage[0]) ? values.landingPage[0] : null;


  console.log("values validate", values.landingPage);

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
  console.log("errors", JSON.stringify(errors));
  /*
   else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
   errors.email = 'Invalid email address'
   }
   */
  return errors
}

const renderLandingpage = ({ fields, meta: { touched, error, submitFailed }, helptextItems }) => {
  return (
    <div>
      {fields.map((item, index) =>
        <Field
          key={index}
          name={`${item}`}
          component={InputField} label="Landingsside"
        />
      )}
    </div>
  );
};


//let FormTitle = props => {
class FormTitle extends React.Component {
  render() {
    const {handleSubmit, pristine, submitting, helptextItems} = this.props;
    //console.log(JSON.stringify(props.initialValues));
    return (
      <form onSubmit={ handleSubmit }>
        <div className="form-group">
          <Helptext title="Tittel" required helptextItems={helptextItems.Distribution_modified}/>
          <Field name="title.nb" component={InputField} label="Tittel"/>
        </div>
        <div className="form-group">
          <Helptext title="Beskrivelse av datasettet" required helptextItems={helptextItems.Dataset_description}/>
          <Field name="description.nb" component={TextAreaField} label="Beskrivelse"/>
        </div>
        <div className="form-group">
          <Helptext title="Formålet med datasettet" helptextItems={helptextItems.Dataset_objective}/>
          <Field name="objective.nb" component={TextAreaField} label="Formål"/>
        </div>

        <div className="form-group">
          <Helptext title="Lenke til mer informasjon om datasettet" helptextItems={helptextItems.Dataset_landingpage}/>
          <FieldArray
            name="landingPage"
            component={renderLandingpage}
            helptextItems={helptextItems}
          />
        </div>
      </form>
    )
  }
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
FormTitle = reduxForm({
  form: 'title',  // a unique identifier for this form,
  validate,
  asyncValidate,
  //asyncBlurFields: [ 'title.nb', 'description.nb', 'objective.nb', 'landingPage'],
  //asyncBlurFields: [],
  asyncChangeFields: [],
  //destroyOnUnmount: false
})(FormTitle)

// You have to connect() to any reducers that you wish to connect to yourself

FormTitle = connect(
  state => ({
    //initialValues: state.dataset.result // pull initial values from dataset reducer

    initialValues: {
      title: state.dataset.result.title || null,
      description: state.dataset.result.description || null,
      objective: state.dataset.result.objective || null,
      landingPage: state.dataset.result.landingPage || null
    }

  })
)(FormTitle)

export default FormTitle;
