import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';

import '../field-input-tags/field-input-tags.scss';

const InputTagsFieldArray = ({ input, label, fieldLabel, showLabel }) => {
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
    <div className="pl-2">
      <label className="fdk-form-label w-100" htmlFor={input.name}>
        {showLabel ? label : null}
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
  showLabel: false
};

InputTagsFieldArray.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  fieldLabel: PropTypes.string,
  showLabel: PropTypes.bool
};

export default InputTagsFieldArray;
