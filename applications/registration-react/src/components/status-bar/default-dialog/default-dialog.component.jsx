import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import cx from 'classnames';
import { Button } from 'reactstrap';
import localization from '../../../lib/localization';

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

const renderToggleShowValidationButton = onShowValidationError => (
  <Button
    id="dataset-setPublish-button"
    className="fdk-button mr-3"
    color="primary"
    onClick={onShowValidationError}
  >
    {localization.formStatus.publish}
  </Button>
);

export const DefaultDialog = ({
  onShowValidationError,
  onShowConfirmDelete,
  justPublishedOrUnPublished,
  published,
  type,
  isSaving,
  formComponent,
  allowPublish,
  error
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
        'fadeFromBottom-500',
        messageClass
      )}
    >
      <div>{message}</div>
      <div className="d-flex">
        {/* if it is not allowed to publish, it is still a llowed to unpublish */}
        {allowPublish || published
          ? formComponent
          : renderToggleShowValidationButton(onShowValidationError)}

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
  formComponent: null,
  allowPublish: true
};

DefaultDialog.propTypes = {
  onShowValidationError: PropTypes.func,
  onShowConfirmDelete: PropTypes.func,
  type: PropTypes.oneOf(['dataset', 'api']).isRequired,
  isSaving: PropTypes.bool,
  error: PropTypes.object,
  published: PropTypes.bool,
  justPublishedOrUnPublished: PropTypes.bool,
  formComponent: PropTypes.object,
  allowPublish: PropTypes.bool
};