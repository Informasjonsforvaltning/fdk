import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';
import '../field-input-tags/field-input-tags.scss';

const handleChange = (props, tags) => {
  const { fieldLabel } = props;
  let updates = [];
  updates = tags.map(item => ({ [fieldLabel]: item }));
  props.input.onChange(updates);
};

const InputTagsFieldArray = props => {
  const { input, label, fieldLabel, showLabel } = props;
  let tagNodes = [];

  if (input && input.value && input.value.length > 0) {
    tagNodes = input.value.map(item => item[fieldLabel]);
  }
  /* eslint-disable */
  return (
    <div className="pl-2">
      <label className="fdk-form-label w-100" htmlFor={input.name}>
        {showLabel ? label : null}
        <div className="d-flex align-items-center">
          <TagsInput
            value={tagNodes}
            className="fdk-reg-input-tags"
            inputProps={{ placeholder: '' }}
            onChange={tags => handleChange(props, tags)}
          />
        </div>
      </label>
    </div>
  );
  /* eslint-enable */
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
