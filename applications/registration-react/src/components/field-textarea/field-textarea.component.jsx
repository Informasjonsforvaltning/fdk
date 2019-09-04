import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const TextAreaField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  showLabel,
  language
}) => (
  <div className={cx('pl-2', { 'multilingual-field': !!language })}>
    <label className="fdk-form-label w-100" htmlFor={input.name}>
      {showLabel ? label : null}
      {language && <span className="language-indicator">{language}</span>}
      <textarea rows="5" {...input} type={type} className="form-control" />
    </label>
    {touched &&
      ((error && <div className="alert alert-danger mt-3">{error}</div>) ||
        (warning && <div className="alert alert-warning mt-3">{warning}</div>))}
  </div>
);

TextAreaField.defaultProps = {
  showLabel: false,
  input: null,
  label: null,
  type: null,
  meta: null,
  language: null
};

TextAreaField.propTypes = {
  showLabel: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  language: PropTypes.string
};

export default TextAreaField;
