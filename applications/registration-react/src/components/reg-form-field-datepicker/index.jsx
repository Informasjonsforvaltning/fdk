import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import './index.scss';

const handleChange = (props, date) => {
  props.meta.touched.true;
  console.log("DATO ER: ", moment(date).format('YYYY-MM-DD'))
  props.input.onChange(moment(date).format('YYYY-MM-DD'));
}

const DatepickerField  = (props) => {
  const { input, label, showLabel } = props;
  return (
    <div className="pl-2">
      {showLabel && (
        <label className="fdk-form-label">{label}</label>
      )}
      <div className="d-flex align-items-center">
        <DatePicker
          className="fdk-reg-datepicker"
          dateFormat="DD.MM.YYYY"
          locale="nb-no"
          showYearDropdown
          yearDropdownItemNumber={5}
          selected={input.value ? moment(input.value): ''}
          onChange={(date) => handleChange(props, date)}
        />
      </div>

    </div>
  );
}

DatepickerField.defaultProps = {
  showLabel: false
};

DatepickerField.propTypes = {
  showLabel: PropTypes.bool
};

export default DatepickerField;
