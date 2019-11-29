import React, { useState } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import localization from '../../services/localization';
import './status-bar.scss';
import { ErrorDialog } from './error-dialog/error-dialog.component';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog.component';
import { ValidationErrorDialog } from './validation-error-dialog/validation-error-dialog.component';
import { DefaultDialog } from './default-dialog/default-dialog.component';

export const StatusBar = ({
  type,
  isSaving,
  lastSaved,
  error,
  justPublishedOrUnPublished,
  onDelete,
  allowPublish,
  onChange,
  registrationStatus
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showValidatonError, setShowValidationError] = useState(false);

  return (
    <>
      {error && <ErrorDialog error={error} lastSaved={lastSaved} />}
      {showConfirmDelete && (
        <ConfirmDialog
          onConfirm={onDelete}
          onCancel={() => setShowConfirmDelete(false)}
          confirmText={localization.formStatus[type].confirmDeleteMessage}
          confirmButtonText={localization.formStatus.confirmDelete}
        />
      )}
      {showValidatonError && (
        <ValidationErrorDialog
          type={type}
          onCancel={() => setShowValidationError(false)}
        />
      )}
      <DefaultDialog
        onShowValidationError={() => setShowValidationError(true)}
        onShowConfirmDelete={() => setShowConfirmDelete(true)}
        justPublishedOrUnPublished={justPublishedOrUnPublished}
        type={type}
        isSaving={isSaving}
        allowPublish={allowPublish}
        onChange={status => onChange(status)}
        registrationStatus={registrationStatus}
      />
    </>
  );
};

StatusBar.defaultProps = {
  isSaving: false,
  lastSaved: null,
  error: null,
  justPublishedOrUnPublished: false,
  onDelete: noop,
  allowPublish: true,
  onChange: noop,
  registrationStatus: null
};

StatusBar.propTypes = {
  type: PropTypes.oneOf(['dataset', 'api']).isRequired,
  isSaving: PropTypes.bool,
  lastSaved: PropTypes.string,
  error: PropTypes.object,
  justPublishedOrUnPublished: PropTypes.bool,
  onDelete: PropTypes.func,
  allowPublish: PropTypes.bool,
  onChange: PropTypes.func,
  registrationStatus: PropTypes.string
};
