import _get from 'lodash/get';

import {
  validateMinTwoChars,
  validateURL
} from '../../../validation/validation';
import localization from '../../../services/localization';

const validate = values => {
  const errors = {};
  const { informationModel } = values;
  let informationModelNodes = null;
  if (informationModel) {
    informationModelNodes = informationModel.map(item => {
      let itemErrors = {};
      const informationModelPrefLabel = _get(
        item,
        ['prefLabel', localization.getLanguage()],
        null
      );
      const informationModelURI = item.uri || null;
      itemErrors = validateMinTwoChars(
        'prefLabel',
        informationModelPrefLabel,
        itemErrors
      );
      itemErrors = validateURL('uri', informationModelURI, itemErrors);
      return itemErrors;
    });
    let showSyncError = false;
    showSyncError =
      informationModelNodes.filter(
        item => item && JSON.stringify(item) !== '{}'
      ).length > 0;
    if (showSyncError) {
      errors.informationModel = informationModelNodes;
    }
  }
  return errors;
};

export default validate;
