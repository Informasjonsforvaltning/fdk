import React from 'react';
import PropTypes from 'prop-types';

export const TwoColRow = props => {
  const { col1, col2 } = props;
  return (
    <div className="row list-regular--item">
      <div className="col-4 pl-0 fdk-text-strong">{col1}</div>
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
  col2: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ])
};
