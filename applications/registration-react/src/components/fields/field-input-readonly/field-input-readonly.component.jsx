import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const InputFieldReadonly = ({
  input,
  label,
  showLabel,
  language,
  isOnlyOneSelectedLanguage
}) => (
  <>
    {input.value.length > 0 && (
      <div className={cx('pl-2', { 'multilingual-field': !!language })}>
        <label className="fdk-form-label w-100" htmlFor={input.name}>
          {showLabel ? label : null}
          <div className="readonly-language-field">
            {!isOnlyOneSelectedLanguage && (
              <div className="p-2">
                <div className="indicator">{language}</div>
              </div>
            )}
            <div className="read-only-text">{input.value}</div>
          </div>
        </label>
      </div>
    )}
  </>
);

InputFieldReadonly.defaultProps = {
  showLabel: false,
  input: null,
  label: null,
  language: null,
  isOnlyOneSelectedLanguage: false
};

InputFieldReadonly.propTypes = {
  showLabel: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.string,
  language: PropTypes.string,
  isOnlyOneSelectedLanguage: PropTypes.bool
};

export default InputFieldReadonly;
