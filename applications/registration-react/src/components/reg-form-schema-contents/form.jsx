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
        name={`${item}.prefLabel.nb`}
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
                title="Standard"
                helptextItems={helptextItems.Dataset_conformsTo}
              />
              <FieldArray
                name="conformsTo"
                component={renderStandard}
                titleLabel={localization.schema.conformsTo.titleLabel}
                linkLabel={localization.schema.conformsTo.linkLabel}
              />
            </div>
          </div>
        }
      </div>
      <div className="form-group">
        <Helptext
          title="Relevans"
          helptextItems={helptextItems.Dataset_hasQualityAnnotation_relevance}
        />
        <Field
          name="hasRelevanceAnnotation.hasBody.nb"
          component={TextAreaField}
          label="Relevans"
        />
      </div>
      <div className="form-group">
        <Helptext
          title="Kompletthet"
          helptextItems={
            helptextItems.Dataset_hasQualityAnnotation_completeness
          }
        />
        <Field
          name="hasCompletenessAnnotation.hasBody.nb"
          component={TextAreaField}
          label="Kompletthet"
        />
      </div>
      <div className="form-group">
        <Helptext
          title="Nøyaktighet"
          helptextItems={helptextItems.Dataset_hasQualityAnnotation_accuracy}
        />
        <Field
          name="hasAccuracyAnnotation.hasBody.nb"
          component={TextAreaField}
          label="Nøyaktighet"
        />
      </div>
      <div className="form-group">
        <Helptext
          title="Tilgjengelighet"
          helptextItems={
            helptextItems.Dataset_hasQualityAnnotation_availability
          }
        />
        <Field
          name="hasAvailabilityAnnotation.hasBody.nb"
          component={TextAreaField}
          label="Tilgjengelighet"
        />
      </div>
    </form>
  );
};

FormContentsComponent.propTypes = {
  helptextItems: PropTypes.object.isRequired
};

export default FormContentsComponent;
