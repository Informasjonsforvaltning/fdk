import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';
import cx from 'classnames';

import '../field-input-tags/field-input-tags.scss';

const InputTagsFieldArray = ({
  input,
  label,
  fieldLabel,
  showLabel,
  language
}) => {
  let tagNodes = [];

  if (input && input.value && input.value.length > 0) {
    tagNodes = input.value.map(item => item[fieldLabel]);
  }

  const handleChange = tags => {
    debugger;

    // We are getting keyword.nb here instead of keyword. @See: multilingual-field-component

    input.onChange(tags.map(item => ({ [language || fieldLabel]: item })));
  };

  return (
    <div className={cx('pl-2', { 'multilingual-field': !!language })}>
      <label className="fdk-form-label w-100" htmlFor={input.name}>
        {showLabel ? label : null}
        {language && <span className="language-indicator">{language}</span>}
        <TagsInput
          value={tagNodes}
          className="fdk-reg-input-tags"
          inputProps={{ placeholder: '' }}
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

InputTagsFieldArray.defaultProps = {
  label: null,
  fieldLabel: null,
  showLabel: false,
  language: null
};

InputTagsFieldArray.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  fieldLabel: PropTypes.string,
  showLabel: PropTypes.bool,
  language: PropTypes.string
};

export default InputTagsFieldArray;
