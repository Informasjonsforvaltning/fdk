import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';
import './field-input-tags.scss';

const handleChange = (props, tags) => {
  props.input.onChange(tags);
};

const InputTagsField = props => {
  const {
    input,
    label,
    meta: { touched, error, warning },
    showLabel
  } = props;
  return (
    <div className="pl-2">
      <label className="fdk-form-label w-100" htmlFor={input.name}>
        {showLabel ? label : null}
        <TagsInput
          {...input}
          className="fdk-reg-input-tags"
          inputProps={{ placeholder: '' }}
          onChange={tags => handleChange(props, tags)}
        />
        {touched &&
          !error && (
            <i className="fa fa-check-circle fa-lg ml-2 fdk-reg-save-success" />
          )}
        {!touched && <i className="fa fa-check-circle fa-lg ml-2 invisible" />}
      </label>
      {touched &&
        ((error && <div className="alert alert-danger mt-3">{error}</div>) ||
          (warning && (
            <div className="alert alert-warning mt-3">{warning}</div>
          )))}
    </div>
  );
};

InputTagsField.defaultProps = {
  showLabel: false,
  input: null,
  label: null,
  meta: null
};

InputTagsField.propTypes = {
  showLabel: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object
};

export default InputTagsField;
