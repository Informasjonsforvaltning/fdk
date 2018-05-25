import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import Helptext from '../reg-form-helptext';
import InputTagsFieldConcepts from '../reg-form-field-input-tags-concepts';
import InputTagsFieldArray from '../reg-form-field-input-tags-objects';

export const FormConcept = props => {
  const {
    syncErrors: { keyword },
    helptextItems
  } = props;
  // if((subject.indexOf('https://') !== -1 || subject.indexOf('http://') !== -1) && !this.subjectLookupInProgress) {
  return (
    <form>
      <div className="form-group">
        <Helptext
          title="Begrep"
          helptextItems={helptextItems.Dataset_content}
        />
        <Field
          name="subject"
          type="text"
          component={InputTagsFieldConcepts}
          label="Geografisk avgrensning"
          fieldLabel="no"
        />
      </div>
      <div className="form-group">
        <Helptext
          title="Søkeord"
          helptextItems={helptextItems.Dataset_keyword}
        />
        <Field
          name="keyword"
          type="text"
          component={InputTagsFieldArray}
          label="Søkeord"
          fieldLabel="nb"
        />
        {keyword && <div className="alert alert-danger mt-3">{keyword.nb}</div>}
      </div>
    </form>
  );
};

FormConcept.defaultProps = {
  syncErrors: null
};
FormConcept.propTypes = {
  syncErrors: PropTypes.object,
  helptextItems: PropTypes.object.isRequired
};

export default FormConcept;
