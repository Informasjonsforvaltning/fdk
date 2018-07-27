import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import Form from './form';
import validate from './formValidations';
import asyncValidate from '../../utils/asyncValidate';
import {
  conformsToType,
  relevanceAnnotationType,
  completenessAnnotationType,
  accuracyAnnotationType,
  availabilityAnnotationType
} from '../../schemaTypes';

const FormContents = reduxForm({
  form: 'contents',
  validate,
  asyncValidate,
  asyncChangeFields: []
})(Form);

const mapStateToProps = ({ dataset }) => ({
  initialValues: {
    conformsTo:
      dataset.result.conformsTo && dataset.result.conformsTo.length > 0
        ? dataset.result.conformsTo
        : [conformsToType],
    hasRelevanceAnnotation:
      dataset.result.hasRelevanceAnnotation || relevanceAnnotationType,
    hasCompletenessAnnotation:
      dataset.result.hasCompletenessAnnotation || completenessAnnotationType,
    hasAccuracyAnnotation:
      dataset.result.hasAccuracyAnnotation || accuracyAnnotationType,
    hasAvailabilityAnnotation:
      dataset.result.hasAvailabilityAnnotation || availabilityAnnotationType
  }
});

const mergeProps = (stateProps, dispatchProps, ownProps) =>
  Object.assign({}, stateProps, dispatchProps, ownProps);

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(FormContents);
