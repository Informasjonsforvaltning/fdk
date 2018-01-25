import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const RadioField  = ({ input, label, type, meta: { touched, error, warning }, asyncValidate }) => {
  return (
    <div className="form-check fdk-form-check">
      <input {...input} type="radio" className="form-check-input" id={input.value} /*onChange={e => {e.preventDefault(); asyncValidate();}}*/ />
      <label className="form-check-label fdk-form-check-label" htmlFor={input.value}>
        {input.value}
      </label>
    </div>
  );

}

RadioField.defaultProps = {

};

RadioField.propTypes = {

};

export default RadioField;
