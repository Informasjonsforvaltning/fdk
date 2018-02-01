import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import TextAreaField from '../reg-form-field-textarea';
import RadioField from '../reg-form-field-radio';
import asyncValidate from '../../utils/asyncValidate';
import { textType, emptyArray } from '../../schemaTypes';

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

let FormAccessRights = (props) => {
  const { fields, helptextItems } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext helptextItems={helptextItems.Dataset_distribution} />
        <Field name="accessRights.uri" component={RadioField} type="radio" value="http://publications.europa.eu/resource/authority/access-right/PUBLIC" label="Offentlig" onChange={(e, value) => {asyncValidate({uri: value, prefLabel: {}})}} />
        <Field name="accessRights.uri" component={RadioField} type="radio" value="http://publications.europa.eu/resource/authority/access-right/RESTRICTED" label="Begrenset offentlighet" onChange={(e, value) => {asyncValidate({accessRights: fields.getAll()})}} />
        <Field name="accessRights.uri" component={RadioField} type="radio" value="http://publications.europa.eu/resource/authority/access-right/NON-PUBLIC" label="Unntatt offentlighet" />
      </div>
    </form>
  )
}

FormAccessRights = reduxForm({
  form: 'accessRights',
  validate,
  asyncValidate,
  asyncChangeFields: [],
})(FormAccessRights)

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      accessRights: (dataset.result.accessRights) ? dataset.result.accessRights : ''
    }
  }
)

export default connect(mapStateToProps)(FormAccessRights)
