import { validateMinTwoChars } from '../../validation/validation';

const validate = values => {
  let errors = {};
  const { keyword } = values;

  if (keyword) {
    keyword.forEach(item => {
      errors = validateMinTwoChars('keyword', item.nb, errors);
    });
  }
  return errors;
};

export default validate;
