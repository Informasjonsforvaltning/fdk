import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const handleChange = (props, selectedURI) => {
  const { input, label, type, meta: { touched, error, warning } } = props;
  props.meta.touched.true;
  if (!selectedURI) {
    props.input.onChange(
      {
        uri: null,
        prefLabel: {
          no: null
        }
      }
    );
  } else {
    const selectedFrequencyItem = props.items.find(item => item.uri === selectedURI);
    props.input.onChange(
      selectedFrequencyItem
    );
  }
}

const SelectField  = (props) => {
  const { input, label, type, meta: { touched, error, warning }, items } = props;
  return (
    <div className="pl-2">
      <label className="fdk-form-label">{label}</label>
      <div>
        <Select
          id="frequency-select"
          options={items}
          simpleValue
          clearable
          name="selected-state"
          disabled={false}
          value={input.value.uri}
          valueKey="uri"
          labelKey="prefLabel_no"
          onChange={(selectedURI) => (handleChange(props, selectedURI))}
          rtl={false}
          searchable
        />
      </div>
      {touched && ((error &&
      <div className="alert alert-danger mt-3">{error}</div>) || (warning && <div className="alert alert-warning mt-3">{warning}</div>))
      }
    </div>
  );
}

SelectField.defaultProps = {

};

SelectField.propTypes = {

};

export default SelectField;
