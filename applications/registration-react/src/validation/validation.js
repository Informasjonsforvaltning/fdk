import localization from '../utils/localization';

export const validateRequired = (nameOfObject, value, errors, useLangField = true) => {
  if (!value) {
    errors[`${nameOfObject}`] = useLangField ? {nb: localization.validation.required} : localization.validation.required
  }
  return errors;
}

export const validateMinTwoChars = (nameOfObject, value, errors, useLangField = true) => {
  if (value && value.length < 2) {
    errors[`${nameOfObject}`] = useLangField ? {nb: localization.validation.minTwoChars} : localization.validation.minTwoChars
  }
  return errors;
}

export const validateAtLeastRequired = (nameOfObject, value, minRequired, errors, useLangField = true) => {
  if (value && value.length <= minRequired) {
    errors[`${nameOfObject}`] = useLangField ? {nb: localization.validation.required} : localization.validation.required
  }
  return errors;
}

