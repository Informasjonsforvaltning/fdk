import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const InputField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  showLabel,
  language,
  isOnlyOneSelectedLanguage
}) => (
  <div className={cx('pl-2', { 'multilingual-field': !!language })}>
    <div className="d-flex align-items-center">
      <label className="fdk-form-label w-100" htmlFor={input.name}>
        {showLabel ? label : null}
        {!!language && !isOnlyOneSelectedLanguage && (
          <span className="language-indicator">{language}</span>
        )}
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
  meta: null,
  language: null,
  isOnlyOneSelectedLanguage: false
};

InputField.propTypes = {
  showLabel: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  language: PropTypes.string,
  isOnlyOneSelectedLanguage: PropTypes.bool
};

export default InputField;
