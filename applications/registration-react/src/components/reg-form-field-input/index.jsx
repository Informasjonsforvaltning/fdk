import React from 'react';
import PropTypes from 'prop-types';

const InputField  = ({ input, label, type, meta: { touched, error, warning }, showLabel }) => (
  <div className="pl-2">
    {showLabel && (
      <label className="fdk-form-label">{label}</label>
    )}
    <div className="d-flex align-items-center">
      <input {...input} type={type} className="form-control" />
      {/* {touched && !error && */}
      {/* <i className="fa fa-check-circle fa-lg ml-2 fdk-reg-save-success" /> */}
      {/* } */}
      {/* {!touched && */}
      {/* <i className="fa fa-check-circle fa-lg ml-2 invisible" /> */}
      {/* } */}
    </div>
    {touched && ((error &&
      <div className="alert alert-danger mt-3">{error}</div>) || (warning && <div className="alert alert-warning mt-3">{warning}</div>))
    }
  </div>
)

InputField.defaultProps = {
  showLabel: false
};

InputField.propTypes = {
  showLabel: PropTypes.bool
};

export default InputField;
