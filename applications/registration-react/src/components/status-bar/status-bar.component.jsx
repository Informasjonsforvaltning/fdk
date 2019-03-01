import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { withState, withHandlers, compose } from 'recompose';
import { Button } from 'reactstrap';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment/locale/nb';

import localization from '../../lib/localization';
import './status-bar.scss';

const StatusBar = props => {
  const {
    type,
    isSaving,
    lastSaved,
    error,
    published,
    justPublishedOrUnPublished,
    onDelete,
    confirmDelete,
    onToggleConfirmDelete,
    showDialogRequiredFields,
    onToggleShowDialogRequiredFields,
    formComponent,
    allowPublish
  } = props;

  const statusBarClassnames = cx(
    'form-status-bar',
    'd-flex',
    'align-items-center',
    'justify-content-between',
    'fadeFromBottom-500',
    {
      'alert-primary': !justPublishedOrUnPublished,
      'alert-success': justPublishedOrUnPublished,
      'alert-warning': error,
      'alert-danger': confirmDelete
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
    <React.Fragment>
      {confirmDelete && (
        <div className="form-status-bar-confirmDelete d-flex align-items-center justify-content-between alert-danger">
          <div>
            <span>{localization.formStatus[type].confirmDeleteMessage}</span>
          </div>
          <div>
            <Button
              className="fdk-button mr-3"
              color="primary"
              onClick={onDelete}
            >
              {localization.formStatus.confirmDelete}
            </Button>
            <button
              className="btn bg-transparent fdk-color-blue-dark"
              onClick={onToggleConfirmDelete}
            >
              {localization.formStatus.cancelDelete}
            </button>
          </div>
        </div>
      )}
      {showDialogRequiredFields && (
        <div className="form-status-bar-confirmDelete d-flex align-items-center justify-content-between alert-danger">
          <div>
            <span>{localization.formStatus[type].requiredFieldsMissing}</span>
          </div>
          <div>
            <button
              className="btn bg-transparent fdk-color-blue-dark"
              onClick={onToggleShowDialogRequiredFields}
            >
              {localization.app.cancel}
            </button>
          </div>
        </div>
      )}
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

          {error === 'network' && (
            <span>{localization.formStatus.error.network}</span>
          )}
          {error &&
            error !== 'network' && (
              <span>
                {localization.formStatus.error.saving}
                {lastSaved && (
                  <React.Fragment>
                    {` ${localization.app.lastSaved} `}
                    <Moment locale="nb" calendar={calendarStrings}>
                      {lastSaved}
                    </Moment>
                  </React.Fragment>
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
                onClick={onToggleShowDialogRequiredFields}
              >
                {localization.formStatus.publish}
              </Button>
            )}
          {!error && (
            <button
              className="btn bg-transparent fdk-color-blue-dark"
              disabled={published || isSaving || error}
              onClick={onToggleConfirmDelete}
            >
              {localization.formStatus.delete}
            </button>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

StatusBar.defaultProps = {
  isSaving: false,
  lastSaved: null,
  error: null,
  published: false,
  justPublishedOrUnPublished: false,
  onDelete: _.noop,
  confirmDelete: false,
  onToggleConfirmDelete: _.noop,
  showDialogRequiredFields: false,
  onToggleShowDialogRequiredFields: _.noop,
  formComponent: null,
  allowPublish: true
};

StatusBar.propTypes = {
  type: PropTypes.oneOf(['dataset', 'api']).isRequired,
  isSaving: PropTypes.bool,
  lastSaved: PropTypes.string,
  error: PropTypes.number,
  published: PropTypes.bool,
  justPublishedOrUnPublished: PropTypes.bool,
  onDelete: PropTypes.func,
  confirmDelete: PropTypes.bool,
  onToggleConfirmDelete: PropTypes.func,
  showDialogRequiredFields: PropTypes.bool,
  onToggleShowDialogRequiredFields: PropTypes.func,
  formComponent: PropTypes.object,
  allowPublish: PropTypes.bool
};

const enhance = compose(
  withState('confirmDelete', 'toggleConfirmDelete', false),
  withState(
    'showDialogRequiredFields',
    'toggleShowDialogRequiredFields',
    false
  ),
  withHandlers({
    onToggleConfirmDelete: props => e => {
      e.preventDefault();
      props.toggleConfirmDelete(!props.confirmDelete);
    },
    onToggleShowDialogRequiredFields: props => e => {
      e.preventDefault();
      props.toggleShowDialogRequiredFields(!props.showDialogRequiredFields);
    }
  })
);

export const StatusBarWithState = enhance(StatusBar);
