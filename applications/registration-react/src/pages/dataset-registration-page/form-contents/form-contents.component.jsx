import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';
import TextAreaField from '../../../components/field-textarea/field-textarea.component';
import MultilingualField from '../../../components/multilingual-field/multilingual-field.component';

export const renderStandardFields = (item, index, fields, fieldProps) => (
  <div className="d-flex mb-5" key={index}>
    <div className="w-50">
      <Field
        name={`${item}.prefLabel.${localization.getLanguage()}`}
        component={InputField}
        label={fieldProps.titleLabel}
        showLabel
      />
    </div>
    <div className="w-50">
      <Field
        name={`${item}.uri`}
        component={InputField}
        label={fieldProps.linkLabel}
        showLabel
      />
    </div>
  </div>
);

// At the moment, support only one standard entry
export const renderStandard = fieldProps => {
  const { fields } = fieldProps;
  return (
    <div>
      {fields &&
        fields.map((item, index) =>
          renderStandardFields(item, index, fields, fieldProps)
        )}
    </div>
  );
};

export const FormContentsComponent = ({ languages }) => (
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
              component={renderStandard}
              titleLabel={localization.schema.common.titleLabel}
              linkLabel={localization.schema.common.linkLabel}
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
        component={TextAreaField}
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
        component={TextAreaField}
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
        component={TextAreaField}
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
        component={TextAreaField}
        label={localization.schema.content.hasAvailabilityAnnotationLabel}
        languages={languages}
      />
    </div>
  </form>
);

FormContentsComponent.defaultProps = {
  languages: []
};

FormContentsComponent.propTypes = {
  languages: PropTypes.array
};
