import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Button } from 'reactstrap';

import localization from '../../lib/localization';
import './status-bar.scss';
import { ErrorDialog } from './error-dialog/error-dialog.component';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog.component';
import { ValidationErrorDialog } from './validation-error-dialog/validation-error-dialog.component';

const renderMessageForPublishStatusChange = ({ published, type }) =>
  published
    ? `${localization.formStatus.type[type]} ${localization.formStatus.published}.`
    : `${localization.formStatus.type[type]} ${localization.formStatus.unPublished}.`;

const renderMessageForUpdate = ({ isSaving, published }) => {
  if (isSaving) {
    return `${localization.formStatus.isSaving}...`;
  }

  if (published) {
    return `${localization.formStatus.changesUpdated}.`;
  }
  return `${localization.formStatus.savedAsDraft}.`;
};

export const StatusBar = props => {
  const {
    type,
    isSaving,
    lastSaved,
    error,
    published,
    justPublishedOrUnPublished,
    onDelete,
    formComponent,
    allowPublish
  } = props;

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const toggleShowConfirmDelete = () =>
    setShowConfirmDelete(!showConfirmDelete);

  const [showValidatonError, setShowValidationError] = useState(false);
  const toggleShowValidationError = () =>
    setShowValidationError(!showValidatonError);

  let messageClass;
  let message;
  if (justPublishedOrUnPublished) {
    messageClass = 'alert-success';
    message = renderMessageForPublishStatusChange({ published, type });
  } else {
    messageClass = 'alert-primary';
    message = renderMessageForUpdate({ isSaving, published });
  }

  const renderToggleShowValidationButton = () => (
    <Button
      id="dataset-setPublish-button"
      className="fdk-button mr-3"
      color="primary"
      onClick={toggleShowValidationError}
    >
      {localization.formStatus.publish}
    </Button>
  );

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
      <div
        className={cx(
          'form-status-bar',
          'd-flex',
          'align-items-center',
          'justify-content-between',
          'fadeFromBottom-500',
          messageClass
        )}
      >
        <div>{message}</div>
        <div className="d-flex">
          {/* if it is not allowed to publish, it is still a llowed to unpublish */}
          {allowPublish || published
            ? formComponent
            : renderToggleShowValidationButton()}

          <button
            type="button"
            className="btn bg-transparent fdk-color-link"
            disabled={published || isSaving || error}
            onClick={toggleShowConfirmDelete}
          >
            {localization.formStatus.delete}
          </button>
        </div>
      </div>
    </>
  );
};

StatusBar.defaultProps = {
  isSaving: false,
  lastSaved: null,
  error: null,
  published: false,
  justPublishedOrUnPublished: false,
  onDelete: _.noop(),
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
