import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import localization from '../../../utils/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputTagsFieldConcepts from './input-tags-concepts/input-tags-concepts.component';
import InputTagsFieldArray from '../../../components/field-input-tags-objects/field-input-tags-objects.component';

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
          title={localization.schema.concept.helptext.content}
          helptextItems={helptextItems.Dataset_content}
        />
        <Field
          name="subject"
          type="text"
          component={InputTagsFieldConcepts}
          label={localization.schema.concept.conceptLabel}
          fieldLabel="no"
        />
      </div>
      <div className="form-group">
        <Helptext
          title={localization.schema.concept.helptext.keyword}
          helptextItems={helptextItems.Dataset_keyword}
        />
        <Field
          name="keyword"
          type="text"
          component={InputTagsFieldArray}
          label={localization.schema.concept.keywordLabel}
          fieldLabel={localization.getLanguage()}
        />
        {keyword && (
          <div className="alert alert-danger mt-3">
            {keyword[localization.getLanguage()]}
          </div>
        )}
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
