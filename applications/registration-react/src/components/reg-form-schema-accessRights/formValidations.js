import {
  validateRequired,
  validateMinTwoChars,
  validateURL
} from '../../validation/validation';

const validate = values => {
  let errors = {};
  const accessRight =
    values.accessRights && values.accessRights.uri
      ? values.accessRights.uri
      : null;
  const {
    legalBasisForRestriction,
    legalBasisForProcessing,
    legalBasisForAccess
  } = values;
  let legalBasisForRestrictionNodes = null;
  let legalBasisForProcessingNodes = null;
  let legalBasisForAccessNodes = null;

  errors = validateRequired('accessRight', accessRight, errors);

  if (legalBasisForRestriction) {
    legalBasisForRestrictionNodes = legalBasisForRestriction.map(item => {
      let itemErrors = {};
      const legalBasisForRestrictionPrefLabel =
        item.prefLabel && item.prefLabel.nb ? item.prefLabel.nb : null;
      const legalBasisForRestrictionURI = item.uri ? item.uri : null;

      itemErrors = validateMinTwoChars(
        'prefLabel',
        legalBasisForRestrictionPrefLabel,
        itemErrors
      );
      itemErrors = validateURL('uri', legalBasisForRestrictionURI, itemErrors);

      return itemErrors;
    });
    let showSyncError = false;
    showSyncError =
      legalBasisForRestrictionNodes.filter(
        item => item && JSON.stringify(item) !== '{}'
      ).length > 0;
    if (showSyncError) {
      errors.legalBasisForRestriction = legalBasisForRestrictionNodes;
    }
  }

  if (legalBasisForProcessing) {
    legalBasisForProcessingNodes = legalBasisForProcessing.map(item => {
      let itemErrors = {};
      const legalBasisForProcessingPrefLabel =
        item.prefLabel && item.prefLabel.nb ? item.prefLabel.nb : null;
      const legalBasisForProcessingURI = item.uri ? item.uri : null;

      itemErrors = validateMinTwoChars(
        'prefLabel',
        legalBasisForProcessingPrefLabel,
        itemErrors
      );
      itemErrors = validateURL('uri', legalBasisForProcessingURI, itemErrors);

      return itemErrors;
    });
    let showSyncError = false;
    showSyncError =
      legalBasisForProcessingNodes.filter(
        item => item && JSON.stringify(item) !== '{}'
      ).length > 0;
    if (showSyncError) {
      errors.legalBasisForProcessing = legalBasisForProcessingNodes;
    }
  }

  if (legalBasisForAccess) {
    legalBasisForAccessNodes = legalBasisForAccess.map(item => {
      let itemErrors = {};
      const legalBasisForAccessPrefLabel =
        item.prefLabel && item.prefLabel.nb ? item.prefLabel.nb : null;
      const legalBasisForAccessURI = item.uri ? item.uri : null;

      itemErrors = validateMinTwoChars(
        'prefLabel',
        legalBasisForAccessPrefLabel,
        itemErrors
      );
      itemErrors = validateURL('uri', legalBasisForAccessURI, itemErrors);

      return itemErrors;
    });
    let showSyncError = false;
    showSyncError =
      legalBasisForAccessNodes.filter(
        item => item && JSON.stringify(item) !== '{}'
      ).length > 0;
    if (showSyncError) {
      errors.legalBasisForAccess = legalBasisForAccessNodes;
    }
  }

  return errors;
};

export default validate;
