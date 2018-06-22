import _get from 'lodash/get';

import {
  validateMinTwoChars,
  validateLinkReturnAsSkosType,
  validateURL
} from '../../validation/validation';
import localization from '../../utils/localization';

const validate = values => {
  const errors = {};
  const { distribution } = values;
  let errorNodes = null;
  let conformsToNodes = null;

  if (distribution) {
    errorNodes = distribution.map(item => {
      let errors = {};

      const accessURL = item.accessURL || null;
      const license = _get(item, ['license', 'uri'], null);
      const description = _get(
        item,
        ['description', localization.getLanguage()],
        null
      );
      const page =
        item.page && item.page[0] && item.page[0].uri ? item.page[0].uri : null;
      const { conformsTo } = item || null;

      errors = validateURL('accessURL', accessURL[0], errors, true);
      errors = validateMinTwoChars('license', license, errors, 'uri');
      errors = validateMinTwoChars('description', description, errors);
      errors = validateLinkReturnAsSkosType('page', page, errors, 'uri');

      if (conformsTo) {
        conformsToNodes = conformsTo.map(item => {
          let itemErrors = {};
          const conformsToPrefLabel = _get(
            item,
            ['prefLabel', localization.getLanguage()],
            null
          );
          const conformsToURI = item.uri || null;
          itemErrors = validateMinTwoChars(
            'prefLabel',
            conformsToPrefLabel,
            itemErrors
          );
          itemErrors = validateURL('uri', conformsToURI, itemErrors);
          return itemErrors;
        });
        let showSyncError = false;
        showSyncError =
          conformsToNodes.filter(item => item && JSON.stringify(item) !== '{}')
            .length > 0;
        if (showSyncError) {
          errors.conformsTo = conformsToNodes;
        }
      }
      return errors;
    });
    let showSyncError = false;
    showSyncError =
      errorNodes.filter(item => item && JSON.stringify(item) !== '{}').length >
      0;
    if (showSyncError) {
      errors.distribution = errorNodes;
    }
  }
  return errors;
};

export default validate;
