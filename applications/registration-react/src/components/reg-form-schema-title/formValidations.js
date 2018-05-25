import {
  validateRequired,
  validateMinTwoChars,
  validateURL
} from '../../validation/validation';

const validate = values => {
  let errors = {};
  const title = values.title && values.title.nb ? values.title.nb : null;
  const description =
    values.description && values.description.nb ? values.description.nb : null;
  const objective =
    values.objective && values.objective.nb ? values.objective.nb : null;
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
