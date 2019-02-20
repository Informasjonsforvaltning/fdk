import { validateURL } from '../../../validation/validation';

export const validate = ({ deprecationInfoReplacedWithUrl }) => {
  let errors = {};

  errors = validateURL(
    'deprecationInfoReplacedWithUrl',
    deprecationInfoReplacedWithUrl,
    errors,
    true
  );

  return errors;
};
