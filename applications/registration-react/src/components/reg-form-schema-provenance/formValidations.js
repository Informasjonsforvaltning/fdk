import { validateMinTwoChars } from '../../validation/validation';

const validate = values => {
  const errors = {};
  let errorHasCurrentnessAnnotation = {};
  const hasCurrentnessAnnotation =
    values.hasCurrentnessAnnotation && values.hasCurrentnessAnnotation.hasBody
      ? values.hasCurrentnessAnnotation.hasBody.no
      : null;
  errorHasCurrentnessAnnotation = validateMinTwoChars(
    'hasBody',
    hasCurrentnessAnnotation,
    errorHasCurrentnessAnnotation,
    'no'
  );

  if (JSON.stringify(errorHasCurrentnessAnnotation) !== '{}') {
    errors.hasCurrentnessAnnotation = errorHasCurrentnessAnnotation;
  }
  return errors;
};

export default validate;
