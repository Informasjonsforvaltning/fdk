import { validateMinTwoChars } from '../../../validation/validation';
import localization from '../../../lib/localization';

const validate = values => {
  let errors = {};
  const { keyword } = values;

  if (keyword) {
    keyword.forEach(item => {
      errors = validateMinTwoChars(
        'keyword',
        item[localization.getLanguage()],
        errors
      );
    });
  }
  return errors;
};

export default validate;
