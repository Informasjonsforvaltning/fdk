import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const handleChange = (props, selectedURI) => {
  const { input, items } = props;
  if (!selectedURI) {
    input.onChange(
      {
        uri: null,
        prefLabel: {
          no: null
        }
      }
    );
  } else {
    const selectedFrequencyItem = items.find(item => item.uri === selectedURI);
    input.onChange(
      selectedFrequencyItem
    );
  }
}

const SelectField  = (props) => {
  const { input, meta: { touched, error, warning }, items } = props;
  return (
    <div className="pl-2 mt-3">
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
        placeholder="Velg"
      />
      {touched && ((error &&
      <div className="alert alert-danger mt-3">{error}</div>) || (warning && <div className="alert alert-warning mt-3">{warning}</div>))
      }
    </div>
  );
}

export default SelectField;
