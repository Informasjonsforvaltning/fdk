import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { getTranslateText } from '../../../lib/translateText';

const handleChange = (props, selectedValue, valueKey, saveObject) => {
  const { input, items } = props;
  let valueToBeSaved;

  // if delete value
  if (!selectedValue) {
    if (saveObject) {
      valueToBeSaved = {
        uri: null,
        prefLabel: {
          no: null
        }
      };
    } else {
      valueToBeSaved = '';
    }
  } else if (saveObject) {
    valueToBeSaved = items.find(item => item[valueKey] === selectedValue);
  } else {
    valueToBeSaved = selectedValue;
  }
  input.onChange(valueToBeSaved);
};

const SelectField = ({
  input,
  meta: { touched, error, warning },
  items,
  valueKey = 'uri',
  labelKey = 'prefLabel',
  saveObject
}) => {
  let referencedInputObject;
  if (typeof input.value === 'string' && items) {
    referencedInputObject = items.find(item => item[valueKey] === input.value);
  }
  return (
    <div className="pl-2 mt-3">
      <Select
        id="frequency-select"
        options={items}
        simpleValue
        clearable
        name="selected-state"
        disabled={false}
        value={
          referencedInputObject
            ? referencedInputObject[valueKey]
            : input.value[valueKey]
        }
        valueKey={valueKey}
        optionRenderer={option => getTranslateText(option[labelKey])}
        valueRenderer={option => getTranslateText(option[labelKey])}
        onChange={selectedValue =>
          handleChange({ input, items }, selectedValue, valueKey, saveObject)
        }
        rtl={false}
        searchable
        placeholder="Velg"
      />
      {touched &&
        ((error && <div className="alert alert-danger mt-3">{error}</div>) ||
          (warning && (
            <div className="alert alert-warning mt-3">{warning}</div>
          )))}
    </div>
  );
};

SelectField.defaultProps = {
  input: null,
  meta: null,
  items: null,
  valueKey: 'uri',
  labelKey: 'prefLabel',
  saveObject: true
};

SelectField.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  items: PropTypes.array,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  saveObject: PropTypes.bool
};

export default SelectField;
