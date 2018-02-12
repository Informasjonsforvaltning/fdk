import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Helptext from '../reg-form-helptext';
import InputTagsFieldConcepts from '../reg-form-field-input-tags-concepts';
import InputTagsFieldArray from '../reg-form-field-input-tags-objects';
import asyncValidate from '../../utils/asyncValidate';

let FormConcept = (props) => {
  const { helptextItems } = props;
  // if((subject.indexOf('https://') !== -1 || subject.indexOf('http://') !== -1) && !this.subjectLookupInProgress) {
  return (
    <form>
      <div className="form-group">
        <Helptext title="Begrep" helptextItems={helptextItems.Dataset_content} />
        <Field
          name="subject"
          type="text"
          component={InputTagsFieldConcepts}
          label="Geografisk avgrensning"
          fieldLabel="no"
        />
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
  asyncValidate
})(FormConcept)

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      subject: (dataset.result.subject && dataset.result.subject.length > 0) ? dataset.result.subject : '',
      keyword: (dataset.result.keyword && dataset.result.keyword.length > 0) ? dataset.result.keyword : ''
    }
  }
)

export default connect(mapStateToProps)(FormConcept)
