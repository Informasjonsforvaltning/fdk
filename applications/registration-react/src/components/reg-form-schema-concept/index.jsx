import React from 'react';
import { Field, reduxForm, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

import Helptext from '../reg-form-helptext';
import InputTagsFieldConcepts from '../reg-form-field-input-tags-concepts';
import InputTagsFieldArray from '../reg-form-field-input-tags-objects';
import asyncValidate from '../../utils/asyncValidate';
import { emptyArray } from '../../schemaTypes';
import { validateMinTwoChars } from '../../validation/validation';

const validate = values => {
  let errors = {};
  const { keyword } = values;

  if (keyword) {
    keyword.map((item, index) => {
      errors = validateMinTwoChars('keyword', item.nb, errors);
    });
  }
  return errors
}

let FormConcept = (props) => {
  const { syncErrors: { keyword }, helptextItems } = props;
  // if((subject.indexOf('https://') !== -1 || subject.indexOf('http://') !== -1) && !this.subjectLookupInProgress) {
  return (
    <form>
      <div className="form-group">

        <Field
          name="subject"
          type="text"
          component={InputTagsFieldConcepts}
          label="Geografisk avgrensning"
          fieldLabel="no"
        />
      </div>
      <div className="form-group">

        <Field
          name="keyword"
          type="text"
          component={InputTagsFieldArray}
          label="Søkeord"
          fieldLabel="nb"
        />
        {keyword &&
        <div className="alert alert-danger mt-3">{keyword.nb}</div>
        }
      </div>
    </form>
  )
}

FormConcept = reduxForm({
  form: 'concept',
  validate,
  asyncValidate
})(connect(state => ({
  syncErrors: getFormSyncErrors("concept")(state)
}))(FormConcept));

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      subject: (dataset.result.subject && dataset.result.subject.length > 0) ? dataset.result.subject : [],
      keyword: (dataset.result.keyword && dataset.result.keyword.length > 0) ? dataset.result.keyword : ''
    }
  }
)

export default connect(mapStateToProps)(FormConcept)
