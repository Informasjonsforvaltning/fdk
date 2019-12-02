import _get from 'lodash/get';

import localization from '../../../services/localization';
import {
  validateRequired,
  validateMinTwoChars
} from '../../../validation/validation';

const validate = values => {
  let errors = {};
  const title = _get(values, ['title', localization.getLanguage()], null);
  const description = _get(
    values,
    ['description', localization.getLanguage()],
    null
  );

  errors = validateRequired('title', title, errors);
  errors = validateMinTwoChars('title', title, errors);

  errors = validateRequired('description', description, errors);
  errors = validateMinTwoChars('description', description, errors);

  return errors;
};

export default validate;
