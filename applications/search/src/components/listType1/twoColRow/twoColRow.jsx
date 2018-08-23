import React from 'react';
import PropTypes from 'prop-types';

export const TwoColRow = props => {
  const { col1, col2 } = props;
  return (
    <div className="row">
      <div className="col-4">{col1}</div>
      <div className="col-8">{col2}</div>
    </div>
  );
};

TwoColRow.defaultProps = {
  col1: null,
  col2: null
};

TwoColRow.propTypes = {
  col1: PropTypes.string,
  col2: PropTypes.string
};
