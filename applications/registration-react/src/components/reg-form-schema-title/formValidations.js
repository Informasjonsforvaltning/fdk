import _get from 'lodash/get';

import {
  validateRequired,
  validateMinTwoChars,
  validateURL
} from '../../validation/validation';
import localization from '../../utils/localization';

const validate = values => {
  let errors = {};
  const title = _get(values, ['title', localization.getLanguage()], null);
  const description = _get(
    values,
    ['description', localization.getLanguage()],
    null
  );
  const objective = _get(
    values,
    ['objective', localization.getLanguage()],
    null
  );
  const landingPage =
    values.landingPage && values.landingPage[0] ? values.landingPage[0] : null;

  errors = validateRequired('title', title, errors);
  errors = validateMinTwoChars('title', title, errors);

  errors = validateRequired('description', description, errors);
  errors = validateMinTwoChars('description', description, errors);

  errors = validateMinTwoChars('objective', objective, errors);

  errors = validateURL('landingPage', landingPage, errors, true);

  return errors;
};

export default validate;
