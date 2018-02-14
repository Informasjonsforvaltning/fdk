import React from 'react';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import TextAreaField from '../reg-form-field-textarea';
import asyncValidate from '../../utils/asyncValidate';
import { conformsToType, relevanceAnnotationType, completenessAnnotationType, accuracyAnnotationType, availabilityAnnotationType } from '../../schemaTypes';

// skal disse være med her - de validerer jo felt et annet sted?
const validate = values => {
  const errors = {}
  const title = (values.title && values.title.nb) ? values.title.nb : null;
  const description = (values.description && values.description.nb) ? values.description.nb : null;
  const objective = (values.objective && values.objective.nb) ? values.objective.nb : null;
  const landingPage = (values.landingPage && values.landingPage[0]) ? values.landingPage[0] : null;
  if (!title) {
    errors.title = {nb: localization.validation.required}
  } else if (title.length < 2) {
    errors.title = {nb: localization.validation.minTwoChars}
  }
  if (description && description.length < 2) {
    errors.description = {nb: localization.validation.minTwoChars}
  }
  if (objective && objective.length < 2) {
    errors.objective = {nb: localization.validation.minTwoChars}
  }
  if (landingPage && landingPage.length < 2) {
    errors.landingPage = [localization.validation.minTwoChars]
  }
  /*
   else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
   errors.email = 'Invalid email address'
   }
   */
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

//At the moment, support only one standard entry
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
  const { helptextItems, hasConformsToUri } = props;
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
})(FormContents)

// Decorate with connect to read form values
const selector = formValueSelector('conformsTo')
FormContents = connect(state => {
  const hasConformsToUri = selector(state, 'conformsTo.uri')
  return {
    hasConformsToUri,
  }
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
