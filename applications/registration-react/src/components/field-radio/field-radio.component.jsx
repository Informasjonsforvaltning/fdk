import React from 'react';
import PropTypes from 'prop-types';

import './field-radio.scss';

const RadioField = ({ input, label, radioId, disabled }) => (
  <label
    className="form-check fdk-form-check mb-0"
    style={{ opacity: disabled ? '0.3' : '1' }}
    htmlFor={radioId}
  >
    <input
      {...input}
      type="radio"
      className="form-check-input"
      id={radioId}
      disabled={disabled}
    />
    <span className="form-check-label fdk-form-check-label" />
    {label}
  </label>
);

RadioField.defaultProps = {
  radioId: '',
  input: null,
  label: null,
  disabled: false
};

RadioField.propTypes = {
  radioId: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.string,
  disabled: PropTypes.bool
};

export default RadioField;
