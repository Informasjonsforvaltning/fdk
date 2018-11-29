import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { withState, withHandlers, compose } from 'recompose';
import { Button } from 'reactstrap';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment/locale/nb';

import localization from '../../utils/localization';
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
    formComponent
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
            <span>
              Er du sikker på at du vil slette API-beskrivelsen permanent?
            </span>
          </div>
          <div>
            <Button
              className="fdk-button mr-3"
              color="primary"
              onClick={onDelete}
            >
              Ja, slett
            </Button>
            <button
              className="btn bg-transparent fdk-color-blue-dark"
              onClick={onToggleConfirmDelete}
            >
              Nei, avbryt
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

          {error === 405 && <span>{localization.formStatus.error[404]}</span>}
          {error &&
            error === 404 && (
              <span>
                {localization.formStatus.error.other}
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
          {/*! error && (
            <ConnectedFormPublish
              initialItemStatus={initialItemStatus}
              match={match}
            />
          ) */}
          {!error && formComponent}
          <button
            className="btn bg-transparent fdk-color-blue-dark"
            disabled={published || isSaving || error}
            onClick={onToggleConfirmDelete}
          >
            {localization.formStatus.delete}
          </button>
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
  onDelete: _.noop(),
  confirmDelete: false,
  onToggleConfirmDelete: _.noop(),
  formComponent: null
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
  formComponent: PropTypes.object
};

const enhance = compose(
  withState('confirmDelete', 'toggleConfirmDelete', false),
  withHandlers({
    onToggleConfirmDelete: props => e => {
      e.preventDefault();
      props.toggleConfirmDelete(!props.confirmDelete);
    }
  })
);

export const StatusBarWithState = enhance(StatusBar);
