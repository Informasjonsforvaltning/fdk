import React from 'react';
import PropTypes from 'prop-types';

const TextAreaField  = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div className="pl-2">
    <label className="fdk-form-label">{label}</label>
    <div className="d-flex align-items-center">
      <textarea rows="5" {...input} type={type} className="form-control" />
      {touched && !error &&
        <i className="fa fa-check-circle fa-lg ml-2 fdk-reg-save-success" />
      }
      {!touched &&
        <i className="fa fa-check-circle fa-lg ml-2 invisible" />
      }
    </div>
    {touched && ((error &&
      <div className="alert alert-danger mt-3">{error}</div>) || (warning && <div className="alert alert-warning mt-3">{warning}</div>))
    }
  </div>
)

TextAreaField.defaultProps = {

};

TextAreaField.propTypes = {

};

export default TextAreaField;
