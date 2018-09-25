import React from 'react';
import PropTypes from 'prop-types';

/* eslint-disable */
const TextAreaField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  showLabel
}) => (
  <div className="pl-2">
    <label className="fdk-form-label w-100" htmlFor={input.name}>
      {showLabel ? label : null}
      <textarea rows="5" {...input} type={type} className="form-control" />
    </label>
    {touched &&
      ((error && <div className="alert alert-danger mt-3">{error}</div>) ||
        (warning && <div className="alert alert-warning mt-3">{warning}</div>))}
  </div>
);
/* eslint-enable */

TextAreaField.defaultProps = {
  showLabel: false,
  input: null,
  label: null,
  type: null,
  meta: null
};

TextAreaField.propTypes = {
  showLabel: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

export default TextAreaField;
