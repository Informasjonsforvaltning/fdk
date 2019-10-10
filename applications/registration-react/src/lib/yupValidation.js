import { unFlattenObject } from './unFlattenObject';

export function yupValidation(schema, values) {
  let validationErrors = {};
  try {
    schema.validateSync(values, { abortEarly: false });
  } catch (errors) {
    errors.inner.forEach(error => {
      if (error.path.includes('[')) {
        validationErrors = {
          ...validationErrors,
          [error.path.split('[')[0]]: [error.message]
        };
      } else {
        validationErrors = { ...validationErrors, [error.path]: error.message };
      }
    });
  }
  return unFlattenObject(validationErrors);
}
