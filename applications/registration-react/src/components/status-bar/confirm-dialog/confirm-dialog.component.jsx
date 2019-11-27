import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import localization from '../../../lib/localization';

export const ConfirmDialog = ({
  onConfirm,
  onCancel,
  confirmText,
  confirmButtonText
}) => (
  <div className="form-status-bar-overlay d-flex align-items-center justify-content-between alert-danger">
    <div>
      <span>{confirmText}</span>
    </div>
    <div>
      <Button className="fdk-button mr-3" color="primary" onClick={onConfirm}>
        {confirmButtonText}
      </Button>
      <button
        type="button"
        className="btn bg-transparent fdk-color-link"
        onClick={onCancel}
      >
        {localization.formStatus.cancelDelete}
      </button>
    </div>
  </div>
);

ConfirmDialog.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string.isRequired,
  confirmButtonText: PropTypes.string.isRequired
};
