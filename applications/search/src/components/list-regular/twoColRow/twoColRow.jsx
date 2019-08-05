import React from 'react';
import PropTypes from 'prop-types';

export const TwoColRow = props => {
  const { col1, col2, col1Width, col2Width } = props;
  return (
    <div className="d-flex list-regular--item">
      <div className={`col-${col1Width || 4} pl-0 fdk-text-strong`}>{col1}</div>
      <div className={`col-${col2Width || 8}`}>{col2}</div>
    </div>
  );
};

TwoColRow.defaultProps = {
  col1: null,
  col2: null,
  col1Width: null,
  col2Width: null
};

TwoColRow.propTypes = {
  col1: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),
  col2: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),
  col1Width: PropTypes.number,
  col2Width: PropTypes.number
};
