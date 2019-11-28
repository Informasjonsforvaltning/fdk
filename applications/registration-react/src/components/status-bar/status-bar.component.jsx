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
  published,
  justPublishedOrUnPublished,
  onDelete,
  allowPublish,
  onChange
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
        published={published}
        type={type}
        isSaving={isSaving}
        allowPublish={allowPublish}
        onChange={status => onChange(status)}
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
  allowPublish: true,
  onChange: noop()
};

StatusBar.propTypes = {
  type: PropTypes.oneOf(['dataset', 'api']).isRequired,
  isSaving: PropTypes.bool,
  lastSaved: PropTypes.string,
  error: PropTypes.object,
  published: PropTypes.bool,
  justPublishedOrUnPublished: PropTypes.bool,
  onDelete: PropTypes.func,
  allowPublish: PropTypes.bool,
  onChange: PropTypes.func
};
