import _get from 'lodash/get';

import {
  validateMinTwoChars,
  validateLinkReturnAsSkosType,
  validateURL
} from '../../../validation/validation';
import localization from '../../../services/localization';

const validate = values => {
  const errors = {};
  const { sample } = values;

  if (sample) {
    const sampleErrors = sample.map(sampleItem => {
      let sampleItemErrors = {};

      const accessURL = _get(sampleItem, 'accessURL', null);
      const license = (sampleItem.license && sampleItem.license.uri) || null;
      const description = _get(
        sampleItem,
        ['description', localization.getLanguage()],
        null
      );
      const page =
        (sampleItem &&
          sampleItem.page &&
          sampleItem.page[0] &&
          sampleItem.page[0].uri) ||
        null;
      const conformsTo = (sampleItem && sampleItem.conformsTo) || null;

      sampleItemErrors = validateURL(
        'accessURL',
        accessURL[0],
        sampleItemErrors,
        true
      );
      sampleItemErrors = validateMinTwoChars(
        'license',
        license,
        sampleItemErrors,
        'uri'
      );
      sampleItemErrors = validateMinTwoChars(
        'description',
        description,
        sampleItemErrors
      );
      sampleItemErrors = validateLinkReturnAsSkosType(
        'page',
        page,
        sampleItemErrors,
        'uri'
      );

      if (conformsTo) {
        const conformsToNodes = conformsTo.map(item => {
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
          sampleItemErrors.conformsTo = conformsToNodes;
        }
      }
      return sampleItemErrors;
    });
    if (
      sampleErrors.filter(item => item && JSON.stringify(item) !== '{}')
        .length > 0
    ) {
      errors.sample = sampleErrors;
    }
  }
  return errors;
};

export default validate;
