import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputTagsFieldArray from '../reg-form-field-input-tags-objects';
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

let FormConcept = (props) => {
  const { helptextItems } = props;
  // if((subject.indexOf('https://') !== -1 || subject.indexOf('http://') !== -1) && !this.subjectLookupInProgress) {
  return (
    <form>
      <div className="form-group">
        <Helptext title="Begrep" helptextItems={helptextItems.Dataset_content} />

      </div>
      <div className="form-group">
        <Helptext title="Søkeord" helptextItems={helptextItems.Dataset_keyword} />
        <Field
          name="keyword"
          type="text"
          component={InputTagsFieldArray}
          label="Søkeord"
          fieldLabel="nb"
        />
      </div>
    </form>
  )
}

FormConcept = reduxForm({
  form: 'concept',
  // validate,
  asyncValidate,
  // asyncChangeFields: [],
})(FormConcept)

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      keyword: (dataset.result.keyword && dataset.result.keyword.length > 0) ? dataset.result.keyword : ''
    }
  }
)

export default connect(mapStateToProps)(FormConcept)
