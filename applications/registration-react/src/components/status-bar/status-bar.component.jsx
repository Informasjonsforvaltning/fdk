import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Button } from 'reactstrap';
import moment from 'moment';
import 'moment/locale/nb';

import localization from '../../lib/localization';
import './status-bar.scss';

const renderErrorMessage = ({ error }) =>
  error.code === 'network_error'
    ? localization.formStatus.error.network
    : localization.formStatus.error.saving;

const renderLastSavedMessage = ({ lastSaved }) => {
  const formatLastSaved = lastSaved =>
    moment(lastSaved).calendar(null, {
      lastDay: '[i går kl.] LT',
      sameDay() {
        return `[for ${this.fromNow()}]`;
      },
      lastWeek: '[på] dddd [kl.] LT',
      sameElse: 'DD.MM.YYYY'
    });

  return ` ${localization.app.lastSaved} ${formatLastSaved(lastSaved)}.`;
};

const renderErrorOverlay = ({ error, lastSaved }) => (
  <div className="form-status-bar-overlay d-flex align-items-center justify-content-between alert-warning">
    {renderErrorMessage({ error, lastSaved })}
    {lastSaved && renderLastSavedMessage({ lastSaved })}
  </div>
);
renderErrorOverlay.defaultProps = {
  lastSaved: ''
};
renderErrorOverlay.propTypes = {
  error: PropTypes.object.isRequired,
  lastSaved: PropTypes.string
};

const renderConfirmDeleteOverlayDialog = ({
  type,
  onDelete,
  toggleShowConfirmDelete
}) => (
  <div className="form-status-bar-overlay d-flex align-items-center justify-content-between alert-danger">
    <div>
      <span>{localization.formStatus[type].confirmDeleteMessage}</span>
    </div>
    <div>
      <Button className="fdk-button mr-3" color="primary" onClick={onDelete}>
        {localization.formStatus.confirmDelete}
      </Button>
      <button
        type="button"
        className="btn bg-transparent fdk-color-link"
        onClick={toggleShowConfirmDelete}
      >
        {localization.formStatus.cancelDelete}
      </button>
    </div>
  </div>
);
renderConfirmDeleteOverlayDialog.propTypes = {
  type: PropTypes.oneOf(['dataset', 'api']).isRequired,
  onDelete: PropTypes.func.isRequired,
  toggleShowConfirmDelete: PropTypes.func.isRequired
};

const renderValidationErrorOverlayDialog = ({
  type,
  toggleShowValidationError
}) => (
  <div className="form-status-bar-overlay d-flex align-items-center justify-content-between alert-danger">
    <div>
      <span>{localization.formStatus[type].requiredFieldsMissing}</span>
    </div>
    <div>
      <button
        type="button"
        className="btn bg-transparent fdk-color-link"
        onClick={toggleShowValidationError}
      >
        {localization.app.cancel}
      </button>
    </div>
  </div>
);
renderValidationErrorOverlayDialog.propTypes = {
  type: PropTypes.oneOf(['dataset', 'api']).isRequired,
  toggleShowValidationError: PropTypes.func.isRequired
};

const renderMessageForPublishStatusChange = ({ published, type }) =>
  published
    ? `${localization.formStatus.type[type]} ${
        localization.formStatus.published
      }.`
    : `${localization.formStatus.type[type]} ${
        localization.formStatus.unPublished
      }.`;

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
      {error && renderErrorOverlay({ error, lastSaved })}
      {showConfirmDelete &&
        renderConfirmDeleteOverlayDialog({
          type,
          onDelete,
          toggleShowConfirmDelete
        })}
      {showValidatonError &&
        renderValidationErrorOverlayDialog({ type, toggleShowValidationError })}
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
  onDelete: _.noop,
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
