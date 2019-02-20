import _get from 'lodash/get';

import {
  validateMinTwoChars,
  validateURL
} from '../../../validation/validation';
import localization from '../../../lib/localization';

const validate = values => {
  const errors = {};
  const { conformsTo } = values;
  let conformsToNodes = null;

  let errorHasRelevanceAnnotation = {};
  const hasRelevanceAnnotation = _get(
    values,
    ['hasRelevanceAnnotation', 'hasBody', localization.getLanguage()],
    null
  );
  errorHasRelevanceAnnotation = validateMinTwoChars(
    'hasBody',
    hasRelevanceAnnotation,
    errorHasRelevanceAnnotation
  );
  if (JSON.stringify(errorHasRelevanceAnnotation) !== '{}') {
    errors.hasRelevanceAnnotation = errorHasRelevanceAnnotation;
  }

  let errorHasCompletenessAnnotation = {};
  const hasCompletenessAnnotation = _get(
    values,
    ['hasCompletenessAnnotation', 'hasBody', localization.getLanguage()],
    null
  );
  errorHasCompletenessAnnotation = validateMinTwoChars(
    'hasBody',
    hasCompletenessAnnotation,
    errorHasCompletenessAnnotation
  );
  if (JSON.stringify(errorHasCompletenessAnnotation) !== '{}') {
    errors.hasCompletenessAnnotation = errorHasCompletenessAnnotation;
  }

  let errorHasAccuracyAnnotation = {};
  const hasAccuracyAnnotation = _get(
    values,
    ['hasAccuracyAnnotation', 'hasBody', localization.getLanguage()],
    null
  );
  errorHasAccuracyAnnotation = validateMinTwoChars(
    'hasBody',
    hasAccuracyAnnotation,
    errorHasAccuracyAnnotation
  );
  if (JSON.stringify(errorHasAccuracyAnnotation) !== '{}') {
    errors.hasAccuracyAnnotation = errorHasAccuracyAnnotation;
  }

  let errorHasAvailabilityAnnotation = {};
  const hasAvailabilityAnnotation = _get(
    values,
    ['hasAvailabilityAnnotation', 'hasBody', localization.getLanguage()],
    null
  );
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
      const conformsToPrefLabel = _get(
        item,
        ['prefLabel', localization.getLanguage()],
        null
      );
      const conformsToURI = item.uri || null;
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
