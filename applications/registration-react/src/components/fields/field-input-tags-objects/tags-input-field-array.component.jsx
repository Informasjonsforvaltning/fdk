import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';
import cx from 'classnames';

import '../field-input-tags/field-input-tags.scss';

const TagsInputFieldArray = ({
  input,
  label,
  fieldLabel,
  showLabel,
  language,
  isOnlyOneSelectedLanguage
}) => {
  let tagNodes = [];

  if (input && input.value && input.value.length > 0) {
    tagNodes = (fieldLabel
      ? input.value.map(item => item[fieldLabel])
      : input.value
    ).filter(Boolean);
  }

  const handleChange = tags =>
    input.onChange(
      (fieldLabel ? tags.map(item => ({ [fieldLabel]: item })) : tags).filter(
        Boolean
      )
    );

  return (
    <div className={cx('pl-2', { 'multilingual-field': !!language })}>
      <label className="fdk-form-label w-100" htmlFor={input.name}>
        {showLabel ? label : null}
        {language && !isOnlyOneSelectedLanguage && (
          <span className="language-indicator">{language}</span>
        )}
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

TagsInputFieldArray.defaultProps = {
  label: null,
  fieldLabel: null,
  showLabel: false,
  language: null,
  isOnlyOneSelectedLanguage: false
};

TagsInputFieldArray.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  fieldLabel: PropTypes.string,
  showLabel: PropTypes.bool,
  language: PropTypes.string,
  isOnlyOneSelectedLanguage: PropTypes.bool
};

export default TagsInputFieldArray;
