import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';
import '../reg-form-field-input-tags/index.scss';

const handleChange = (props, tags) => {
  console.log("InputTagsFieldArray1");
  const { fieldLabel } = props;
  console.log("InputTagsFieldArray2");
  let updates = [];
  console.log("InputTagsFieldArray3");
  updates = tags.map((item) => ({[fieldLabel]:item}))
  console.log("InputTagsFieldArray4");
  props.input.onChange(updates);
  console.log("InputTagsFieldArray5");
}

const InputTagsFieldArray  = (props) => {
  const { input, label, fieldLabel, showLabel } = props;
  let tagNodes = [];

  if (input && input.value && input.value.length > 0) {
    tagNodes = input.value.map((item) => item[fieldLabel] )
  }
  return (
    <div className="pl-2">
      <label className="fdk-form-label w-100" htmlFor={input.name}>
        {showLabel ? label : null}
        <div className="d-flex align-items-center">
          <TagsInput
            value={tagNodes}
            className="fdk-reg-input-tags"
            inputProps={{placeholder: ''}}
            onChange={(tags) => (handleChange(props, tags))}
          />
        </div>
      </label>
    </div>
  );
}

InputTagsFieldArray.defaultProps = {
  showLabel: false
};

InputTagsFieldArray.propTypes = {
  showLabel: PropTypes.bool
};

export default InputTagsFieldArray;
