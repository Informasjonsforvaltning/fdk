import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';
import TextAreaField from '../../../components/field-textarea/field-textarea.component';
import MultilingualField from '../../../components/multilingual-field/multilingual-field.component';

// At the moment, support only one standard entry
export const renderStandard = ({
  fields,
  titleLabel,
  linkLabel,
  languages
}) => (
  <div>
    {fields &&
      fields.map((item, index) => (
        <div className="d-flex flex-column mb-5" key={index}>
          <MultilingualField
            name={`${item}.prefLabel`}
            component={InputField}
            label={titleLabel}
            showLabel
            languages={languages}
          />
          <div className="mt-2">
            <Field
              name={`${item}.uri`}
              component={InputField}
              label={linkLabel}
              showLabel
            />
          </div>
        </div>
      ))}
  </div>
);

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
              languages={languages}
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
