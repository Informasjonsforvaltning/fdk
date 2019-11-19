import React from 'react';
import PropTypes from 'prop-types';
import localization from '../../../../lib/localization';

const addPublisher = (input, publisher) => {
  if (publisher) {
    input.onChange(publisher);
  }
};

export const PublisherField = ({ input, label, showLabel, publisher }) => (
  <div className="d-flex align-items-center">
    <label className="fdk-form-label w-100" htmlFor={input.name}>
      {showLabel ? label : null}
      <button
        name="publisher"
        type="button"
        className="ml-5 btn btn-primary fdk-button"
        onClick={e => {
          e.preventDefault();
          addPublisher(input, publisher);
        }}
      >
        {localization.choose}
      </button>
    </label>
  </div>
);

PublisherField.defaultProps = {
  showLabel: false,
  input: null,
  label: null,
  publisher: null
};

PublisherField.propTypes = {
  showLabel: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.string,
  publisher: PropTypes.object
};
