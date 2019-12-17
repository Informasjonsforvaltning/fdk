import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';

import localization from '../../../services/localization';
import Helptext from '../../../components/helptext/helptext.component';
import TextAreaField from '../../../components/fields/field-textarea/field-textarea.component';
import MultilingualField from '../../../components/multilingual-field/multilingual-field.component';
import { Standard } from './standard/standard.component';
import InputFieldReadonly from '../../../components/fields/field-input-readonly/field-input-readonly.component';

export const FormContentsComponent = ({ languages, isReadOnly }) => (
  <form>
    <div className="form-group">
      {
        <div className="mt-4">
          <div className="form-group">
            <Helptext
              title={localization.schema.content.helptext.conformsTo}
              term="Dataset_conformsTo"
            />
            <FieldArray
              name="conformsTo"
              component={Standard}
              titleLabel={localization.schema.common.titleLabel}
              linkLabel={localization.schema.common.linkLabel}
              languages={languages}
              isReadOnly={isReadOnly}
            />
          </div>
        </div>
      }
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.content.helptext.relevance}
        term="Dataset_hasQualityAnnotation_relevance"
      />
      <MultilingualField
        name="hasRelevanceAnnotation.hasBody"
        component={isReadOnly ? InputFieldReadonly : TextAreaField}
        label={localization.schema.content.hasRelevanceAnnotationLabel}
        languages={languages}
      />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.content.helptext.completeness}
        term="Dataset_hasQualityAnnotation_completeness"
      />
      <MultilingualField
        name="hasCompletenessAnnotation.hasBody"
        component={isReadOnly ? InputFieldReadonly : TextAreaField}
        label={localization.schema.content.hasCompletenessAnnotationLabel}
        languages={languages}
      />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.content.helptext.accuracy}
        term="Dataset_hasQualityAnnotation_accuracy"
      />
      <MultilingualField
        name="hasAccuracyAnnotation.hasBody"
        component={isReadOnly ? InputFieldReadonly : TextAreaField}
        label={localization.schema.content.hasAccuracyAnnotationLabel}
        languages={languages}
      />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.content.helptext.availability}
        term="Dataset_hasQualityAnnotation_availability"
      />
      <MultilingualField
        name="hasAvailabilityAnnotation.hasBody"
        component={isReadOnly ? InputFieldReadonly : TextAreaField}
        label={localization.schema.content.hasAvailabilityAnnotationLabel}
        languages={languages}
      />
    </div>
  </form>
);

FormContentsComponent.defaultProps = {
  languages: [],
  isReadOnly: false
};

FormContentsComponent.propTypes = {
  languages: PropTypes.array,
  isReadOnly: PropTypes.bool
};
