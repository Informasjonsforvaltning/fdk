import React, { useState } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import localization from '../../lib/localization';
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
  published,
  justPublishedOrUnPublished,
  onDelete,
  formComponent,
  allowPublish
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const toggleShowConfirmDelete = () =>
    setShowConfirmDelete(!showConfirmDelete);

  const [showValidatonError, setShowValidationError] = useState(false);
  const toggleShowValidationError = () =>
    setShowValidationError(!showValidatonError);

  return (
    <>
      {error && <ErrorDialog error={error} lastSaved={lastSaved} />}
      {showConfirmDelete && (
        <ConfirmDialog
          onConfirm={onDelete}
          onCancel={toggleShowConfirmDelete}
          confirmText={localization.formStatus[type].confirmDeleteMessage}
          confirmButtonText={localization.formStatus.confirmDelete}
        />
      )}
      {showValidatonError && (
        <ValidationErrorDialog
          type={type}
          onCancel={toggleShowValidationError}
        />
      )}
      <DefaultDialog
        onShowValidationError={toggleShowValidationError}
        onShowConfirmDelete={toggleShowConfirmDelete}
        justPublishedOrUnPublished={justPublishedOrUnPublished}
        published={published}
        type={type}
        isSaving={isSaving}
        formComponent={formComponent}
        allowPublish={allowPublish}
      />
    </>
  );
};

StatusBar.defaultProps = {
  isSaving: false,
  lastSaved: null,
  error: null,
  published: false,
  justPublishedOrUnPublished: false,
  onDelete: noop(),
  formComponent: null,
  allowPublish: true
};

StatusBar.propTypes = {
  type: PropTypes.oneOf(['dataset', 'api']).isRequired,
  isSaving: PropTypes.bool,
  lastSaved: PropTypes.string,
  error: PropTypes.object,
  published: PropTypes.bool,
  justPublishedOrUnPublished: PropTypes.bool,
  onDelete: PropTypes.func,
  formComponent: PropTypes.object,
  allowPublish: PropTypes.bool
};
