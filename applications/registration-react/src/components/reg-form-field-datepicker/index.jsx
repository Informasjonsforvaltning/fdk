import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import './index.scss';

const handleChange = (props, date) => {
  props.input.onChange(moment(date).format('YYYY-MM-DD'));
}

const DatepickerField  = (props) => {
  const { input, label, showLabel } = props;
  return (
    <div className="pl-2">

      <label className="fdk-form-label" htmlFor={input.name}>
        {showLabel ? label : null}
        <DatePicker
          id={input.name}
          className="fdk-reg-datepicker"
          dateFormat="DD.MM.YYYY"
          locale="nb-no"
          showYearDropdown
          yearDropdownItemNumber={5}
          selected={input.value ? moment(input.value): null}
          onChange={(date) => handleChange(props, date)}
        />
      </label>

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
