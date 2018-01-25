import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';
import '../reg-form-field-input-tags/index.scss';

const handleChange = (props, tags) => {
  let updates = [];
  updates = tags.map((item) => ({"uri":item,"prefLabel":{}}))
  props.meta.touched.true;
  props.input.onChange(updates);
}

const InputTagsFieldArray  = (props) => {
  const { input, label, type, meta: { touched, error, warning } } = props;
  let tagNodes = [];

  if (input && input.value && input.value.length > 0) {
    tagNodes = input.value.map((item, index) => item.uri)
  }
  // console.log("input value", JSON.stringify(input.value));
  // console.log("tags", JSON.stringify(tagNodes));

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
