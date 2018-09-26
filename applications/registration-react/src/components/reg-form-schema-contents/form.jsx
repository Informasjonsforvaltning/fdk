import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import TextAreaField from '../reg-form-field-textarea';

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

export const FormContentsComponent = props => {
  const { helptextItems } = props;
  return (
    <form>
      <div className="form-group">
        {
          <div className="mt-4">
            <div className="form-group">
              <Helptext
                title={localization.schema.content.helptext.conformsTo}
                helptextItems={helptextItems.Dataset_conformsTo}
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
          helptextItems={helptextItems.Dataset_hasQualityAnnotation_relevance}
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
          helptextItems={
            helptextItems.Dataset_hasQualityAnnotation_completeness
          }
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
          helptextItems={helptextItems.Dataset_hasQualityAnnotation_accuracy}
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
          helptextItems={
            helptextItems.Dataset_hasQualityAnnotation_availability
          }
        />
        <Field
          name={`hasAvailabilityAnnotation.hasBody.${localization.getLanguage()}`}
          component={TextAreaField}
          label={localization.schema.content.hasAvailabilityAnnotationLabel}
        />
      </div>
    </form>
  );
};

FormContentsComponent.propTypes = {
  helptextItems: PropTypes.object.isRequired
};

export default FormContentsComponent;
