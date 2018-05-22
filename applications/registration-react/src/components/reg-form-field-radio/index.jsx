import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const RadioField = ({ input, label, radioId }) => (
  <label className="form-check fdk-form-check mb-0" htmlFor={radioId}>
    <input {...input} type="radio" className="form-check-input" id={radioId} />
    <span className="form-check-label fdk-form-check-label" />
    {label}
  </label>
);

RadioField.defaultProps = {
  radioId: '',
  input: null,
  label: null
};

RadioField.propTypes = {
  radioId: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.string
};

export default RadioField;
