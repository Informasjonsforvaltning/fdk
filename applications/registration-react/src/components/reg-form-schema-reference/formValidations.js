import localization from '../../utils/localization';

const validate = values => {
  const errors = {};
  const spatial =
    values.spatial && values.spatial.uri ? values.spatial.uri : null;
  if (spatial && spatial.length < 2) {
    errors.spatial = { uri: localization.validation.minTwoChars };
  }
  return errors;
};

export default validate;
