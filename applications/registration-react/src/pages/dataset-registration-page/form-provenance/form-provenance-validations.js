import _get from 'lodash/get';

import { validateMinTwoChars } from '../../../validation/validation';
import localization from '../../../utils/localization';

const validate = values => {
  const errors = {};
  let errorHasCurrentnessAnnotation = {};
  const hasCurrentnessAnnotation = _get(
    values,
    ['hasCurrentnessAnnotation', 'hasBody', localization.getLanguage()],
    null
  );
  errorHasCurrentnessAnnotation = validateMinTwoChars(
    'hasBody',
    hasCurrentnessAnnotation,
    errorHasCurrentnessAnnotation,
    localization.getLanguage()
  );

  if (JSON.stringify(errorHasCurrentnessAnnotation) !== '{}') {
    errors.hasCurrentnessAnnotation = errorHasCurrentnessAnnotation;
  }
  return errors;
};

export default validate;
