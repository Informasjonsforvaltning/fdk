import React from 'react';
import { Field, FieldArray, reduxForm, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import TextAreaField from '../reg-form-field-textarea';
import asyncValidate from '../../utils/asyncValidate';
import shouldAsyncValidate from '../../utils/shouldAsyncValidate';
import { textType, emptyArray } from '../../schemaTypes';
import { validateRequired, validateMinTwoChars} from '../../validation/validation';

const validate = values => {
  let errors = {}

  const title = (values.title && values.title.nb) ? values.title.nb : null;
  const description = (values.description && values.description.nb) ? values.description.nb : null;
  const objective = (values.objective && values.objective.nb) ? values.objective.nb : null;
  const landingPage = (values.landingPage && values.landingPage[0]) ? values.landingPage[0] : null;

  errors = validateRequired('title', title, errors);
  errors = validateMinTwoChars('title', title, errors);

  errors = validateRequired('description', description, errors);
  errors = validateMinTwoChars('description', description, errors);

  errors = validateMinTwoChars('objective', objective, errors);


  /*
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(landingPage)) {
    errors.landingPage = {nb: 'Feiler'}
  }
  */

  return errors
}

const renderLandingpage = ({ fields }) => (
  <div>
    {fields.map((item, index) =>
      (<Field
        key={index}
        name={`${item}`}
        component={InputField}
        label="Landingsside"
      />)
    )}
  </div>
);

let FormTitle = (props) => {
  const { syncErrors, helptextItems } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext title="Tittel" required helptextItems={helptextItems.Distribution_modified} />
        <Field name="title.nb" component={InputField} label="Tittel" />
      </div>
      <div className="form-group">
        <Helptext title="Beskrivelse av datasettet" required helptextItems={helptextItems.Dataset_description} />
        <Field name="description.nb" component={TextAreaField} label="Beskrivelse" />
      </div>
      <div className="form-group">
        <Helptext title="Formålet med datasettet" helptextItems={helptextItems.Dataset_objective} />
        <Field name="objective.nb" component={TextAreaField} label="Formål" />
      </div>

      <div className="form-group">
        <Helptext title="Lenke til mer informasjon om datasettet" helptextItems={helptextItems.Dataset_landingpage} />
        <FieldArray
          name="landingPage"
          component={renderLandingpage}
          helptextItems={helptextItems}
        />
      </div>
    </form>
  )
}

/*
FormTitle = reduxForm({
  form: 'title',
  validate,
  shouldAsyncValidate,
  asyncValidate,
  asyncChangeFields: [],
})(FormTitle)
*/

FormTitle = reduxForm({
  form: 'title',
  validate,
  shouldAsyncValidate,
  asyncValidate,
  asyncChangeFields: [],
})(connect(state => ({
  syncErrors: getFormSyncErrors("title")(state)
}))(FormTitle));

const mapStateToProps = ({ dataset }, state) => (
  {
    initialValues: {
      title: (dataset.result.title && dataset.result.title.nb && dataset.result.title.nb.length > 0) ? dataset.result.title : textType,
      description: (dataset.result.description && dataset.result.description.nb && dataset.result.description.nb.length > 0) ? dataset.result.description : textType,
      objective: (dataset.result.objective && dataset.result.objective.nb && dataset.result.objective.nb.length > 0) ? dataset.result.objective : textType,
      landingPage: dataset.result.landingPage || emptyArray
    }
  }
)

export default connect(mapStateToProps)(FormTitle)
