import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import localization from '../../../services/localization';
import { Helptext } from '../../../components/helptext/helptext.component';
import LookupTagsInputField from '../../../components/fields/lookup-tags-input-field/lookup-tags-input-field.component';
import { ConceptTagReadOnlyField } from './concept-tags-readonly-field/concept-tags-readonly-field';
import TagsInputFieldArray from '../../../components/fields/field-input-tags-objects/tags-input-field-array.component';
import MultilingualField from '../../../components/multilingual-field/multilingual-field.component';
import { getTranslateText } from '../../../services/translateText';
import { renderConceptAutosuggestForTagsInput } from './concept-autosuggest';
import InputFieldReadonly from '../../../components/fields/field-input-readonly/field-input-readonly.component';

export const FormConceptPure = ({ languages, errors, isReadOnly }) => {
  return (
    <form>
      <div className="form-group">
        <Helptext
          title={localization.schema.concept.helptext.content}
          term="Dataset_content"
        />
        {isReadOnly && (
          <Field
            name="concepts"
            component={ConceptTagReadOnlyField}
            languages={languages}
          />
        )}
        {!isReadOnly && (
          <Field
        name="concepts"
        component={LookupTagsInputField}
        getTagFromItem={item => getTranslateText(item.prefLabel)}
        renderLookupInput={renderConceptAutosuggestForTagsInput}
      />
        )}
      </div>
      <div className="form-group">
        <Helptext
          title={localization.schema.concept.helptext.keyword}
          term="Dataset_keyword"
        />
        {isReadOnly && (
          <MultilingualField
            name="keyword"
            languages={languages}
            component={InputFieldReadonly}
            label={localization.schema.concept.keywordLabel}
          />
        )}
        {!isReadOnly && (
          <MultilingualField
            name="keyword"
            languages={languages}
            component={TagsInputFieldArray}
            label={localization.schema.concept.keywordLabel}
          />
        )}

        {errors && errors.keyword && (
          <div className="alert alert-danger mt-3">
            {errors.keyword[localization.getLanguage()]}
          </div>
        )}
      </div>
    </form>
  );
};

FormConceptPure.defaultProps = {
  errors: {},
  languages: [],
  isReadOnly: false
};
FormConceptPure.propTypes = {
  errors: PropTypes.object,
  languages: PropTypes.array,
  isReadOnly: PropTypes.bool
};
