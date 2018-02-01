import React from 'react';
import PropTypes from 'prop-types';

const handleChange = (props, event) => {
  const { input } = props;
  const selectedItemLabel = event.target.value;
  props.meta.touched.true;

  // Skal fjerne fra array
  if (!event.target.checked) {
    input.onChange('');
  } else { // add object
    input.onChange(selectedItemLabel);
  }
}

const types = [
  { 
    id: 1, 
    label: 'Data'
  },
  {
    id: 2,
    label: 'Kodelister'
  },
  {
    id: 3,
    label: 'Tesauri'
  },
  {
    id: 4,
    label: 'Taksonomi'
  },
  {
    id: 5,
    label: 'Testdata'
  },
]

const CheckboxFieldType = (props) => {
  const { input, label } = props;
  return (
    <div>
      {types.map((type, index) => (
        <div key={index} className="form-check fdk-form-checkbox">
          <input type="checkbox" name="types" id={type.label} value={type.label} checked={ (input && input.value === type.label) ? 'checked' : ''} onChange={(e) => {handleChange(props, e)}} />
          <label className="form-check-label fdk-form-check-label" htmlFor={type.label} />
          <span>{type.label}</span>
        </div>
      ))}
    </div>
  );
}

CheckboxFieldType.defaultProps = {

};

CheckboxFieldType.propTypes = {

};

export default CheckboxFieldType;
