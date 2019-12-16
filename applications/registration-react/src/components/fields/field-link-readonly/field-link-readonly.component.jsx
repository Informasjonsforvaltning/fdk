import React from 'react';
import PropTypes from 'prop-types';

const LinkReadonlyField = ({ input, showLabel, label }) => (
  <>
    <div className="pl-2 multilingual-field">
      <label className="fdk-form-label w-100" htmlFor={input.name}>
        {showLabel ? label : null}
        <div>
          <a className="pl-3" href={input.value}>
            {input.value}
          </a>
        </div>
      </label>
    </div>
  </>
);

LinkReadonlyField.defaultProps = {
  input: null,
  showLabel: false,
  label: null
};

LinkReadonlyField.propTypes = {
  input: PropTypes.object,
  showLabel: PropTypes.bool,
  label: PropTypes.string
};

export default LinkReadonlyField;
