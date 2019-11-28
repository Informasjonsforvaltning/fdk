import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import cx from 'classnames';
import { Button } from 'reactstrap';

import localization from '../../../services/localization';
import { ButtonRegistrationStatus } from './button-registration-status/button-registration-status.component';
import {
  isApproved,
  isDraft,
  isPublished
} from '../../../lib/registration-status';

const renderMessageForPublishStatusChange = (registrationStatus, type) => {
  if (isPublished(registrationStatus)) {
    return `${localization.formStatus.type[type]} ${localization.formStatus.published}.`;
  }
  if (isApproved(registrationStatus)) {
    return `${localization.formStatus.type[type]} ${localization.formStatus.approved}.`;
  }
  return `${localization.formStatus.type[type]} ${localization.formStatus.isDraft}.`;
};

const renderMessageForUpdate = (isSaving, registrationStatus) => {
  if (isSaving) {
    return `${localization.formStatus.isSaving}...`;
  }

  if (isPublished(registrationStatus) || isApproved(registrationStatus)) {
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
  registrationStatus,
  onShowConfirmDraft,
  onShowConfirmApprove
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
        {type === 'api' && (
          <ButtonRegistrationStatus
            onChange={onChange}
            published={isPublished(registrationStatus)}
            allowPublish={allowPublish}
            onShowValidationError={onShowValidationError}
          />
        )}
        {type === 'dataset' && (
          <>
            <Button
              id="dataset-setPublish-button"
              className="fdk-button"
              color={isDraft(registrationStatus) ? 'dark' : 'primary'}
              style={{ border: 0, borderRadius: 0 }}
              onClick={onShowConfirmDraft}
            >
              <i className="fa fa-pencil mr-2" />
              {localization.formStatus.draft}
            </Button>
            <Button
              id="dataset-setPublish-button"
              className="fdk-button"
              color={isApproved(registrationStatus) ? 'dark' : 'primary'}
              style={{ border: 0, borderRadius: 0 }}
              onClick={
                isPublished(registrationStatus)
                  ? onShowConfirmApprove
                  : () => onChange('APPROVE')
              }
            >
              <i className="fa fa-check-square-o mr-2" />
              {isApproved(registrationStatus)
                ? localization.formStatus.approveChecked
                : localization.formStatus.approve}
            </Button>
            <Button
              id="dataset-setPublish-button"
              className="fdk-button"
              color={isPublished(registrationStatus) ? 'dark' : 'primary'}
              style={{ border: 0, borderRadius: 0 }}
              onClick={() => onChange('PUBLISH')}
            >
              {isPublished(registrationStatus)
                ? localization.formStatus.publishChecked
                : localization.formStatus.publish}
            </Button>
          </>
        )}
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
  registrationStatus: PropTypes.string,
  onShowConfirmDraft: PropTypes.func.isRequired,
  onShowConfirmApprove: PropTypes.func.isRequired
};
