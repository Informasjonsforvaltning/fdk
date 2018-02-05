import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput'
import './index.scss';

const handleChange = (props, tags) => {
  props.meta.touched.true;
  props.input.onChange(tags);
}

const InputTagsField  = (props) => {
  const { input, label, type, meta: { touched, error, warning }, showLabel } = props;
  return (
    <div className="pl-2">
      {showLabel && (
        <label className="fdk-form-label">{label}</label>
      )}
      <div className="d-flex align-items-center">
        <TagsInput
          {...input}
          className="fdk-reg-input-tags"
          inputProps={{placeholder: ''}}
          onChange={(tags) => (handleChange(props, tags))}
        />
        {touched && !error &&
          <i className="fa fa-check-circle fa-lg ml-2 fdk-reg-save-success" />
        }
        {!touched &&
          <i className="fa fa-check-circle fa-lg ml-2 invisible" />
        }
      </div>
      {touched && ((error &&
        <div className="alert alert-danger mt-3">{error}</div>) || (warning && <div className="alert alert-warning mt-3">{warning}</div>))
      }
    </div>
  );
}

InputTagsField.defaultProps = {
  showLabel: false
};

InputTagsField.propTypes = {
  showLabel: PropTypes.bool
};

export default InputTagsField;



