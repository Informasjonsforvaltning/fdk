import React from 'react';
import PropTypes from 'prop-types';

export const TreeLosOption = props => {
  const { itemKey, value, label, onClick, activeNode, displayClass } = props;

  const id = encodeURIComponent(itemKey + value);

  let inputRef;

  return (
    <div
      className={`checkbox ${displayClass}`}
      onKeyPress={e => {
        inputRef.click();
        e.preventDefault();
      }}
      tabIndex="0"
      role="button"
    >
      <label className="checkbox_label" htmlFor={id}>
        <input
          ref={input => {
            inputRef = input;
          }}
          type="checkbox"
          id={id}
          tabIndex="-1"
          checked={activeNode}
          onChange={e => onClick(e)}
          className="list-group-item fdk-label fdk-label-default"
          value={value}
        />
        <span className="checkbox-replacement" />
        {label}
      </label>
    </div>
  );
};

TreeLosOption.defaultProps = {
  value: null,
  label: null,
  activeNode: null,
  displayClass: null
};

TreeLosOption.propTypes = {
  itemKey: PropTypes.number.isRequired,
  value: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  activeNode: PropTypes.bool,
  displayClass: PropTypes.string
};
