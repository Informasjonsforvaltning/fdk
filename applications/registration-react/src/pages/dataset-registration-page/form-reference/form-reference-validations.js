import _get from 'lodash/get';

import localization from '../../../lib/localization';

const validate = values => {
  const errors = {};
  const spatial = _get(values, ['spatial', 'uri'], null);
  if (spatial && spatial.length < 2) {
    errors.spatial = { uri: localization.validation.minTwoChars };
  }
  return errors;
};

export default validate;
