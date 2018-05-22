import { validateAtLeastRequired } from '../../validation/validation';

const validate = values => {
  let errors = {};
  const { theme } = values;
  errors = validateAtLeastRequired('errorTheme', theme, 1, errors, false);
  return errors;
};

export default validate;
