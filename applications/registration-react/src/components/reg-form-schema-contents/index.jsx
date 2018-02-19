import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import TextAreaField from '../reg-form-field-textarea';
import asyncValidate from '../../utils/asyncValidate';
import { conformsToType, relevanceAnnotationType, completenessAnnotationType, accuracyAnnotationType, availabilityAnnotationType } from '../../schemaTypes';
import { validateMinTwoChars, validateURL } from '../../validation/validation';

const validate = values => {
  const errors = {}
  const { conformsTo } = values;
  let conformsToNodes = null;

  let errorHasRelevanceAnnotation = {};
  const hasRelevanceAnnotation = (values.hasRelevanceAnnotation && values.hasRelevanceAnnotation.hasBody) ? values.hasRelevanceAnnotation.hasBody.nb : null;
  errorHasRelevanceAnnotation = validateMinTwoChars('hasBody', hasRelevanceAnnotation, errorHasRelevanceAnnotation);
  if (JSON.stringify(errorHasRelevanceAnnotation) !== '{}') {
    errors.hasRelevanceAnnotation = errorHasRelevanceAnnotation;
  }

  let errorHasCompletenessAnnotation = {};
  const hasCompletenessAnnotation = (values.hasCompletenessAnnotation && values.hasCompletenessAnnotation.hasBody) ? values.hasCompletenessAnnotation.hasBody.nb : null;
  errorHasCompletenessAnnotation = validateMinTwoChars('hasBody', hasCompletenessAnnotation, errorHasCompletenessAnnotation);
  if (JSON.stringify(errorHasCompletenessAnnotation) !== '{}') {
    errors.hasCompletenessAnnotation = errorHasCompletenessAnnotation;
  }

  let errorHasAccuracyAnnotation = {};
  const hasAccuracyAnnotation = (values.hasAccuracyAnnotation && values.hasAccuracyAnnotation.hasBody) ? values.hasAccuracyAnnotation.hasBody.nb : null;
  errorHasAccuracyAnnotation = validateMinTwoChars('hasBody', hasAccuracyAnnotation, errorHasAccuracyAnnotation);
  if (JSON.stringify(errorHasAccuracyAnnotation) !== '{}') {
    errors.hasAccuracyAnnotation = errorHasAccuracyAnnotation;
  }

  let errorHasAvailabilityAnnotation = {};
  const hasAvailabilityAnnotation = (values.hasAvailabilityAnnotation && values.hasAvailabilityAnnotation.hasBody) ? values.hasAvailabilityAnnotation.hasBody.nb : null;
  errorHasAvailabilityAnnotation = validateMinTwoChars('hasBody', hasAvailabilityAnnotation, errorHasAvailabilityAnnotation);
  if (JSON.stringify(errorHasAvailabilityAnnotation) !== '{}') {
    errors.hasAvailabilityAnnotation = errorHasAvailabilityAnnotation;
  }

  if (conformsTo) {
    conformsToNodes = conformsTo.map(item => {
      let itemErrors = {}
      const conformsToPrefLabel = (item.prefLabel && item.prefLabel.nb) ? item.prefLabel.nb : null;
      const conformsToURI = item.uri ? item.uri : null;
      itemErrors = validateMinTwoChars('prefLabel', conformsToPrefLabel, itemErrors);
      itemErrors = validateURL('uri', conformsToURI, itemErrors);
      return itemErrors;
    });
    let showSyncError = false;
    showSyncError = (conformsToNodes.filter(item => (item && JSON.stringify(item) !== '{}')).length > 0);
    if (showSyncError) {
      errors.conformsTo = conformsToNodes;
    }
  }
  return errors
}

const renderStandardFields = (item, index, fields, props) => (
  <div className="d-flex mb-5" key={index}>
    <div className="w-50">
      <Field
        name={`${item}.prefLabel.nb`}
        component={InputField}
        label={props.titleLabel}
        showLabel
      />
    </div>
    <div className="w-50">
      <Field
        name={`${item}.uri`}
        component={InputField}
        label={props.linkLabel}
        showLabel
      />
    </div>
  </div>
);

// At the moment, support only one standard entry
const renderStandard = (props) => {
  const { fields } = props;
  return (
    <div>
      {fields && fields.map((item, index) =>
        renderStandardFields(item, index, fields, props)
      )}
    </div>
  );
};


let FormContents = (props) => {
  const { helptextItems } = props;
  return (
    <form>
      <div className="form-group">
        {
          <div className="mt-4">
            <div className="form-group">
              <Helptext title="Standard" helptextItems={helptextItems.Dataset_conformsTo} />
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
        <Helptext title="Relevans" helptextItems={helptextItems.Dataset_hasQualityAnnotation_relevance} />
        <Field name="hasRelevanceAnnotation.hasBody.nb" component={TextAreaField} label="Relevans" />
      </div>
      <div className="form-group">
        <Helptext title="Kompletthet" helptextItems={helptextItems.Dataset_hasQualityAnnotation_completeness} />
        <Field name="hasCompletenessAnnotation.hasBody.nb" component={TextAreaField} label="Kompletthet" />
      </div>
      <div className="form-group">
        <Helptext title="Nøyaktighet" helptextItems={helptextItems.Dataset_hasQualityAnnotation_accuracy} />
        <Field name="hasAccuracyAnnotation.hasBody.nb" component={TextAreaField} label="Nøyaktighet" />
      </div>
      <div className="form-group">
        <Helptext title="Tilgjengelighet" helptextItems={helptextItems.Dataset_hasQualityAnnotation_availability} />
        <Field name="hasAvailabilityAnnotation.hasBody.nb" component={TextAreaField} label="Tilgjengelighet" />
      </div>
    </form>

  )
}

FormContents = reduxForm({
  form: 'contents',
  validate,
  asyncValidate,
  asyncChangeFields: [],
})(FormContents)

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      conformsTo: (dataset.result.conformsTo && dataset.result.conformsTo.length > 0) ? dataset.result.conformsTo : [conformsToType],
      hasRelevanceAnnotation: dataset.result.hasRelevanceAnnotation || relevanceAnnotationType,
      hasCompletenessAnnotation: dataset.result.hasCompletenessAnnotation || completenessAnnotationType,
      hasAccuracyAnnotation: dataset.result.hasAccuracyAnnotation || accuracyAnnotationType,
      hasAvailabilityAnnotation: dataset.result.hasAvailabilityAnnotation || availabilityAnnotationType
    }
  }
)

export default connect(mapStateToProps)(FormContents)
