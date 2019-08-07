import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './pill.component.scss';

export const Pill = ({ label, handleOnClick }) => {
  if (!label) {
    return null;
  }

  return (
    <div className="d-flex align-items-center fdk-text-size-15 fdk-bg-color-neutral-darkest fdk-color-neutral-lightest fdk-filter-pill mr-2 mb-2 fade-in-500">
      <span className="text-ellipsis">{label}</span>
      <button type="button" className="d-flex" onClick={handleOnClick}>
        <i className="fa fa-times-circle fdk-bg-color-neutral-darkest fdk-color-neutral-lightest" />
      </button>
    </div>
  );
};

Pill.defaultProps = {
  label: null,
  handleOnClick: _.noop
};

Pill.propTypes = {
  label: PropTypes.string,
  handleOnClick: PropTypes.func
};
