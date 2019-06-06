import React from 'react';
import PropTypes from 'prop-types';

const SortButtons = props => {
  const { field, sortField, sortType, onSortField } = props;
  return (
    <div className="d-flex flex-column">
      <button
        type="button"
        name={`${field}asc`}
        className={`d-flex sortButton transparentButton ${
          sortField === `${field}` && sortType === 'asc'
            ? 'visibilityHidden'
            : ''
        }`}
        onClick={() => onSortField(`${field}`, 'asc')}
        title="Stigende"
      >
        <i className="fa fa-sort-up fdk-color0" />
      </button>
      <button
        type="button"
        name={`${field}desc`}
        className={`d-flex sortButton transparentButton ${
          sortField === `${field}` && sortType === 'desc'
            ? 'visibilityHidden'
            : ''
        }`}
        onClick={() => onSortField(`${field}`, 'desc')}
        title="Synkende"
      >
        <i className="fa fa-sort-down fdk-color0" />
      </button>
    </div>
  );
};

SortButtons.propTypes = {
  field: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  sortType: PropTypes.string.isRequired,
  onSortField: PropTypes.func.isRequired
};

export default SortButtons;
