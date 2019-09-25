import { validateMinTwoChars } from '../../../validation/validation';

const validate = ({ keyword }) => {
  let errors = {};

  if (keyword) {
    Object.values(keyword).forEach(value =>
      Object.values(value).forEach(item => {
        errors = validateMinTwoChars('keyword', item, errors);
      })
    );
  }
  return errors;
};

export default validate;
