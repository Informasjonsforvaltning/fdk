import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import _ from 'lodash';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputTagsFieldConcepts from './input-tags-concepts/input-tags-concepts.component';
import InputTagsFieldArray from '../../../components/field-input-tags-objects/field-input-tags-objects.component';
import MultilingualField from '../../../components/multilingual-field/multilingual-field.component';

export const FormConcept = ({ syncErrors, languages }) => {
  return (
    <form>
      <div className="form-group">
        <Helptext
          title={localization.schema.concept.helptext.content}
          term="Dataset_content"
        />
        <Field
          name="concepts"
          type="text"
          component={InputTagsFieldConcepts}
          label={localization.schema.concept.conceptLabel}
          fieldLabel="no"
        />
      </div>
      <div className="form-group">
        <Helptext
          title={localization.schema.concept.helptext.keyword}
          term="Dataset_keyword"
        />
        <MultilingualField
          name="keyword"
          type="text"
          languages={languages}
          component={InputTagsFieldArray}
          label={localization.schema.concept.keywordLabel}
          // fieldLabel={localization.getLanguage()}
        />
        {_.get(syncErrors, 'keyword') && (
          <div className="alert alert-danger mt-3">
            {_.get(syncErrors, 'keyword')[localization.getLanguage()]}
          </div>
        )}
      </div>
    </form>
  );
};

FormConcept.defaultProps = {
  syncErrors: null,
  languages: []
};
FormConcept.propTypes = {
  syncErrors: PropTypes.object,
  languages: PropTypes.array
};
