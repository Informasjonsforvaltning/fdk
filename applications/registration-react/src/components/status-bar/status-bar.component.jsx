import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Button } from 'reactstrap';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment/locale/nb';

import localization from '../../lib/localization';
import './status-bar.scss';

const renderConfirmDeleteOverlayDialog = ({
  type,
  onDelete,
  toggleShowConfirmDelete
}) => (
  <div className="form-status-bar-confirmDelete d-flex align-items-center justify-content-between alert-danger">
    <div>
      <span>{localization.formStatus[type].confirmDeleteMessage}</span>
    </div>
    <div>
      <Button className="fdk-button mr-3" color="primary" onClick={onDelete}>
        {localization.formStatus.confirmDelete}
      </Button>
      <button
        type="button"
        className="btn bg-transparent fdk-color-blue-dark"
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
  <div className="form-status-bar-confirmDelete d-flex align-items-center justify-content-between alert-danger">
    <div>
      <span>{localization.formStatus[type].requiredFieldsMissing}</span>
    </div>
    <div>
      <button
        type="button"
        className="btn bg-transparent fdk-color-blue-dark"
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

  const statusBarClassnames = cx(
    'form-status-bar',
    'd-flex',
    'align-items-center',
    'justify-content-between',
    'fadeFromBottom-500',
    {
      'alert-primary': !justPublishedOrUnPublished,
      'alert-success': justPublishedOrUnPublished,
      'alert-warning': error
    }
  );

  const calendarStrings = {
    lastDay: '[i går kl.] LT',
    sameDay() {
      return `[for ${moment(lastSaved).fromNow()}]`;
    },
    lastWeek: '[på] dddd [kl.] LT',
    sameElse: 'DD.MM.YYYY'
  };

  return (
    <>
      {showConfirmDelete &&
        renderConfirmDeleteOverlayDialog({
          type,
          onDelete,
          toggleShowConfirmDelete
        })}
      {showValidatonError &&
        renderValidationErrorOverlayDialog({ type, toggleShowValidationError })}
      <div className={statusBarClassnames}>
        <div>
          {justPublishedOrUnPublished &&
            published && (
              <span>
                {localization.formStatus.type[type]}{' '}
                {localization.formStatus.published}.
              </span>
            )}
          {justPublishedOrUnPublished &&
            !published && (
              <span>
                {localization.formStatus.type[type]}{' '}
                {localization.formStatus.unPublished}.
              </span>
            )}

          {!error &&
            !justPublishedOrUnPublished &&
            isSaving && <span>{localization.formStatus.isSaving}...</span>}

          {!error &&
            !justPublishedOrUnPublished &&
            lastSaved &&
            !isSaving &&
            !published && <span>{localization.formStatus.savedAsDraft}.</span>}

          {!error &&
            !justPublishedOrUnPublished &&
            lastSaved &&
            !isSaving &&
            published && <span>{localization.formStatus.changesUpdated}.</span>}

          {error &&
            error.error === 'network_error' && (
              <span>{localization.formStatus.error.network}</span>
            )}
          {error &&
            error.error !== 'network_error' && (
              <span>
                {localization.formStatus.error.saving}
                {lastSaved && (
                  <>
                    {` ${localization.app.lastSaved} `}
                    <Moment locale="nb" calendar={calendarStrings}>
                      {lastSaved}
                    </Moment>
                  </>
                )}
              </span>
            )}
        </div>
        <div className="d-flex">
          {!error && allowPublish && formComponent}
          {!error &&
            !allowPublish && (
              <Button
                id="dataset-setPublish-button"
                className="fdk-button mr-3"
                color="primary"
                onClick={toggleShowValidationError}
              >
                {localization.formStatus.publish}
              </Button>
            )}
          {!error && (
            <button
              type="button"
              className="btn bg-transparent fdk-color-blue-dark"
              disabled={published || isSaving || error}
              onClick={toggleShowConfirmDelete}
            >
              {localization.formStatus.delete}
            </button>
          )}
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
