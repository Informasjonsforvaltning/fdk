import React from 'react';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';
import TextAreaField from '../../../components/field-textarea/field-textarea.component';

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

export const FormContentsComponent = () => (
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
      <Field
        name={`hasRelevanceAnnotation.hasBody.${localization.getLanguage()}`}
        component={TextAreaField}
        label={localization.schema.content.hasRelevanceAnnotationLabel}
      />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.content.helptext.completeness}
        term="Dataset_hasQualityAnnotation_completeness"
      />
      <Field
        name={`hasCompletenessAnnotation.hasBody.${localization.getLanguage()}`}
        component={TextAreaField}
        label={localization.schema.content.hasCompletenessAnnotationLabel}
      />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.content.helptext.accuracy}
        term="Dataset_hasQualityAnnotation_accuracy"
      />
      <Field
        name={`hasAccuracyAnnotation.hasBody.${localization.getLanguage()}`}
        component={TextAreaField}
        label={localization.schema.content.hasAccuracyAnnotationLabel}
      />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.content.helptext.availability}
        term="Dataset_hasQualityAnnotation_availability"
      />
      <Field
        name={`hasAvailabilityAnnotation.hasBody.${localization.getLanguage()}`}
        component={TextAreaField}
        label={localization.schema.content.hasAvailabilityAnnotationLabel}
      />
    </div>
  </form>
);
