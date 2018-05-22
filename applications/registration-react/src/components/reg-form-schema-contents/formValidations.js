import { validateMinTwoChars, validateURL } from '../../validation/validation';

const validate = values => {
  const errors = {};
  const { conformsTo } = values;
  let conformsToNodes = null;

  let errorHasRelevanceAnnotation = {};
  const hasRelevanceAnnotation =
    values.hasRelevanceAnnotation && values.hasRelevanceAnnotation.hasBody
      ? values.hasRelevanceAnnotation.hasBody.nb
      : null;
  errorHasRelevanceAnnotation = validateMinTwoChars(
    'hasBody',
    hasRelevanceAnnotation,
    errorHasRelevanceAnnotation
  );
  if (JSON.stringify(errorHasRelevanceAnnotation) !== '{}') {
    errors.hasRelevanceAnnotation = errorHasRelevanceAnnotation;
  }

  let errorHasCompletenessAnnotation = {};
  const hasCompletenessAnnotation =
    values.hasCompletenessAnnotation && values.hasCompletenessAnnotation.hasBody
      ? values.hasCompletenessAnnotation.hasBody.nb
      : null;
  errorHasCompletenessAnnotation = validateMinTwoChars(
    'hasBody',
    hasCompletenessAnnotation,
    errorHasCompletenessAnnotation
  );
  if (JSON.stringify(errorHasCompletenessAnnotation) !== '{}') {
    errors.hasCompletenessAnnotation = errorHasCompletenessAnnotation;
  }

  let errorHasAccuracyAnnotation = {};
  const hasAccuracyAnnotation =
    values.hasAccuracyAnnotation && values.hasAccuracyAnnotation.hasBody
      ? values.hasAccuracyAnnotation.hasBody.nb
      : null;
  errorHasAccuracyAnnotation = validateMinTwoChars(
    'hasBody',
    hasAccuracyAnnotation,
    errorHasAccuracyAnnotation
  );
  if (JSON.stringify(errorHasAccuracyAnnotation) !== '{}') {
    errors.hasAccuracyAnnotation = errorHasAccuracyAnnotation;
  }

  let errorHasAvailabilityAnnotation = {};
  const hasAvailabilityAnnotation =
    values.hasAvailabilityAnnotation && values.hasAvailabilityAnnotation.hasBody
      ? values.hasAvailabilityAnnotation.hasBody.nb
      : null;
  errorHasAvailabilityAnnotation = validateMinTwoChars(
    'hasBody',
    hasAvailabilityAnnotation,
    errorHasAvailabilityAnnotation
  );
  if (JSON.stringify(errorHasAvailabilityAnnotation) !== '{}') {
    errors.hasAvailabilityAnnotation = errorHasAvailabilityAnnotation;
  }

  if (conformsTo) {
    conformsToNodes = conformsTo.map(item => {
      let itemErrors = {};
      const conformsToPrefLabel =
        item.prefLabel && item.prefLabel.nb ? item.prefLabel.nb : null;
      const conformsToURI = item.uri ? item.uri : null;
      itemErrors = validateMinTwoChars(
        'prefLabel',
        conformsToPrefLabel,
        itemErrors
      );
      itemErrors = validateURL('uri', conformsToURI, itemErrors);
      return itemErrors;
    });
    let showSyncError = false;
    showSyncError =
      conformsToNodes.filter(item => item && JSON.stringify(item) !== '{}')
        .length > 0;
    if (showSyncError) {
      errors.conformsTo = conformsToNodes;
    }
  }
  return errors;
};

export default validate;
