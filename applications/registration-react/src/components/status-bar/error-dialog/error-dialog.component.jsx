import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/nb';

import localization from '../../../services/localization';

const renderErrorMessage = error =>
  error.code === 'network_error'
    ? localization.formStatus.error.network
    : localization.formStatus.error.saving;

const formatLastSaved = lastSaved =>
  moment(lastSaved).calendar(null, {
    lastDay: '[i går kl.] LT',
    sameDay() {
      return `[for ${this.fromNow()}]`;
    },
    lastWeek: '[på] dddd [kl.] LT',
    sameElse: 'DD.MM.YYYY'
  });

const renderLastSavedMessage = lastSaved =>
  ` ${localization.app.lastSaved} ${formatLastSaved(lastSaved)}.`;

export const ErrorDialog = ({ error, lastSaved }) => (
  <div className="form-status-bar-overlay d-flex align-items-center justify-content-between alert-warning">
    {renderErrorMessage(error)}
    {lastSaved && renderLastSavedMessage(lastSaved)}
  </div>
);

ErrorDialog.defaultProps = {
  lastSaved: ''
};
ErrorDialog.propTypes = {
  error: PropTypes.object.isRequired,
  lastSaved: PropTypes.string
};
