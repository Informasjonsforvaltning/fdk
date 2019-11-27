import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../lib/localization';

export const ValidationErrorDialog = ({ type, onCancel }) => (
  <div className="form-status-bar-overlay d-flex align-items-center justify-content-between alert-danger">
    <div>
      <span>{localization.formStatus[type].requiredFieldsMissing}</span>
    </div>
    <div>
      <button
        type="button"
        className="btn bg-transparent fdk-color-link"
        onClick={onCancel}
      >
        {localization.app.cancel}
      </button>
    </div>
  </div>
);

ValidationErrorDialog.propTypes = {
  type: PropTypes.oneOf(['dataset', 'api']).isRequired,
  onCancel: PropTypes.func.isRequired
};
