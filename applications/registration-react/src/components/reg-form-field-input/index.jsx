import React from 'react';
import PropTypes from 'prop-types';

const InputField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  showLabel
}) => (
  <div className="pl-2">
    <div className="d-flex align-items-center">
      <label className="fdk-form-label w-100" htmlFor={input.name}>
        {showLabel ? label : null}
        <input {...input} type={type} className="form-control" />
      </label>
    </div>
    {touched &&
      ((error && <div className="alert alert-danger mt-3">{error}</div>) ||
        (warning && <div className="alert alert-warning mt-3">{warning}</div>))}
  </div>
);

InputField.defaultProps = {
  showLabel: false,
  input: null,
  label: null,
  type: null,
  meta: null
};

InputField.propTypes = {
  showLabel: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

export default InputField;
