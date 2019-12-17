import _ from 'lodash';

import {
  validateMinTwoChars,
  validateLinkReturnAsSkosType,
  validateURL
} from '../../../validation/validation';
import localization from '../../../services/localization';

const validate = values => {
  const errors = {};
  const { distribution } = values;
  let conformsToNodes = null;

  if (distribution) {
    const distributionErrors = distribution.map(distributionItem => {
      let itemErrors = {};

      const accessURL = _.get(distributionItem, ['accessURL', 0]);
      const license = _.get(distributionItem, ['license', 'uri'], null);
      const description = _.get(
        distributionItem,
        ['description', localization.getLanguage()],
        null
      );
      const page =
        distributionItem.page &&
        distributionItem.page[0] &&
        distributionItem.page[0].uri
          ? distributionItem.page[0].uri
          : null;
      const { conformsTo } = distributionItem || null;

      itemErrors = validateURL('accessURL', accessURL, itemErrors, true);
      itemErrors = validateMinTwoChars('license', license, itemErrors, 'uri');
      itemErrors = validateMinTwoChars('description', description, itemErrors);
      itemErrors = validateLinkReturnAsSkosType(
        'page',
        page,
        itemErrors,
        'uri'
      );

      if (conformsTo) {
        conformsToNodes = conformsTo.map(conformsToItem => {
          let conformsToItemErrors = {};
          const conformsToPrefLabel = _.get(
            conformsToItem,
            ['prefLabel', localization.getLanguage()],
            null
          );
          const conformsToURI = conformsToItem.uri || null;
          conformsToItemErrors = validateMinTwoChars(
            'prefLabel',
            conformsToPrefLabel,
            conformsToItemErrors
          );
          conformsToItemErrors = validateURL(
            'uri',
            conformsToURI,
            conformsToItemErrors
          );
          return conformsToItemErrors;
        });
        let showSyncError = false;
        showSyncError =
          conformsToNodes.filter(item => item && JSON.stringify(item) !== '{}')
            .length > 0;
        if (showSyncError) {
          itemErrors.conformsTo = conformsToNodes;
        }
      }
      return itemErrors;
    });
    if (
      distributionErrors.filter(item => item && JSON.stringify(item) !== '{}')
        .length > 0
    ) {
      errors.distribution = distributionErrors;
    }
  }
  return errors;
};

export default validate;
