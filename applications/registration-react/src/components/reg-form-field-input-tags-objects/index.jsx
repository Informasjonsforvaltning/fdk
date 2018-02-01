import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';
import '../reg-form-field-input-tags/index.scss';

const handleChange = (props, tags) => {
  const { fieldLabel } = props;
  let updates = [];
  updates = tags.map((item) => ({[fieldLabel]:item}))
  props.meta.touched.true;
  props.input.onChange(updates);
}

const InputTagsFieldArray  = (props) => {
  const { input, label, type, meta: { touched, error, warning }, fieldLabel } = props;
  console.log("fieldLabel", fieldLabel);
  let tagNodes = [];

  if (input && input.value && input.value.length > 0) {
    tagNodes = input.value.map((item, index) => item[fieldLabel] )
  }
  return (
    <div className="pl-2">
      <label className="fdk-form-label">{label}</label>
      <div className="d-flex align-items-center">
        <TagsInput
          value={tagNodes}
          className="fdk-reg-input-tags"
          inputProps={{placeholder: ''}}
          onChange={(tags) => (handleChange(props, tags))}
        />
      </div>

    </div>
  );
}

InputTagsFieldArray.defaultProps = {

};

InputTagsFieldArray.propTypes = {

};

export default InputTagsFieldArray;
