import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import cx from 'classnames';
import localization from '../../../services/localization';
import { ButtonRegistrationStatus } from './button-registration-status/button-registration-status.component';

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

export const DefaultDialog = ({
  onShowValidationError,
  onShowConfirmDelete,
  justPublishedOrUnPublished,
  published,
  type,
  isSaving,
  allowPublish,
  error,
  onChange
}) => {
  let messageClass;
  let message;
  if (justPublishedOrUnPublished) {
    messageClass = 'alert-success';
    message = renderMessageForPublishStatusChange({ published, type });
  } else {
    messageClass = 'alert-primary';
    message = renderMessageForUpdate({ isSaving, published });
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
          published={published}
          allowPublish={allowPublish}
          onShowValidationError={onShowValidationError}
        />

        <button
          type="button"
          className="btn bg-transparent fdk-color-link"
          disabled={published || isSaving || error}
          onClick={onShowConfirmDelete}
        >
          {localization.formStatus.delete}
        </button>
      </div>
    </div>
  );
};

DefaultDialog.defaultProps = {
  onShowValidationError: noop(),
  onShowConfirmDelete: noop(),
  isSaving: false,
  error: null,
  published: false,
  justPublishedOrUnPublished: false,
  allowPublish: true,
  onChange: noop()
};

DefaultDialog.propTypes = {
  onShowValidationError: PropTypes.func,
  onShowConfirmDelete: PropTypes.func,
  type: PropTypes.oneOf(['dataset', 'api']).isRequired,
  isSaving: PropTypes.bool,
  error: PropTypes.object,
  published: PropTypes.bool,
  justPublishedOrUnPublished: PropTypes.bool,
  allowPublish: PropTypes.bool,
  onChange: PropTypes.func
};
