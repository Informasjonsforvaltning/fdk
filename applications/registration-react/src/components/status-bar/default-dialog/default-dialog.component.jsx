import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import cx from 'classnames';
import localization from '../../../services/localization';
import { ButtonRegistrationStatus } from './button-registration-status/button-registration-status.component';
import { isPublished } from '../../../lib/registration-status';

const renderMessageForPublishStatusChange = (registrationStatus, type) => {
  if (isPublished(registrationStatus)) {
    return `${localization.formStatus.type[type]} ${localization.formStatus.published}.`;
  }
  return `${localization.formStatus.type[type]} ${localization.formStatus.unPublished}.`;
};

const renderMessageForUpdate = (isSaving, registrationStatus) => {
  if (isSaving) {
    return `${localization.formStatus.isSaving}...`;
  }

  if (isPublished(registrationStatus)) {
    return `${localization.formStatus.changesUpdated}.`;
  }
  return `${localization.formStatus.savedAsDraft}.`;
};

export const DefaultDialog = ({
  onShowValidationError,
  onShowConfirmDelete,
  justPublishedOrUnPublished,
  type,
  isSaving,
  allowPublish,
  error,
  onChange,
  registrationStatus
}) => {
  let messageClass;
  let message;
  if (justPublishedOrUnPublished) {
    messageClass = 'alert-success';
    message = renderMessageForPublishStatusChange(registrationStatus, type);
  } else {
    messageClass = 'alert-primary';
    message = renderMessageForUpdate(isSaving, registrationStatus);
  }

  return (
    <div
      className={cx(
        'form-status-bar',
        'd-flex',
        'align-items-center',
        'justify-content-between',
        messageClass
      )}
    >
      <div>{message}</div>
      <div className="d-flex">
        <ButtonRegistrationStatus
          onChange={onChange}
          published={isPublished(registrationStatus)}
          allowPublish={allowPublish}
          onShowValidationError={onShowValidationError}
        />

        <button
          type="button"
          className="btn bg-transparent fdk-color-link"
          disabled={isPublished(registrationStatus) || isSaving || error}
          onClick={onShowConfirmDelete}
        >
          {localization.formStatus.delete}
        </button>
      </div>
    </div>
  );
};

DefaultDialog.defaultProps = {
  onShowValidationError: noop,
  onShowConfirmDelete: noop,
  isSaving: false,
  error: null,
  justPublishedOrUnPublished: false,
  allowPublish: true,
  onChange: noop,
  registrationStatus: null
};

DefaultDialog.propTypes = {
  onShowValidationError: PropTypes.func,
  onShowConfirmDelete: PropTypes.func,
  type: PropTypes.oneOf(['dataset', 'api']).isRequired,
  isSaving: PropTypes.bool,
  error: PropTypes.object,
  justPublishedOrUnPublished: PropTypes.bool,
  allowPublish: PropTypes.bool,
  onChange: PropTypes.func,
  registrationStatus: PropTypes.string
};
