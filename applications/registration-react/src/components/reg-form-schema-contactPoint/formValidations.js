import {
  validateMinTwoChars,
  validateURL,
  validateEmail,
  validatePhone
} from '../../validation/validation';

const validate = values => {
  const errors = {};
  const { contactPoint } = values;
  let contactPointNodes = null;
  if (contactPoint) {
    contactPointNodes = contactPoint.map(item => {
      let itemErrors = {};
      itemErrors = validateMinTwoChars(
        'organizationUnit',
        item.organizationUnit,
        itemErrors,
        null,
        false
      );
      itemErrors = validateURL('hasURL', item.hasURL, itemErrors);
      itemErrors = validateEmail('email', item.email, itemErrors);
      itemErrors = validatePhone('hasTelephone', item.hasTelephone, itemErrors);
      return itemErrors;
    });
    let showSyncError = false;
    showSyncError =
      contactPointNodes.filter(item => item && JSON.stringify(item) !== '{}')
        .length > 0;
    if (showSyncError) {
      errors.contactPoint = contactPointNodes;
    }
  }
  return errors;
};

export default validate;
