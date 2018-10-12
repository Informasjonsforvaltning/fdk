import React from 'react';
import PropTypes from 'prop-types';
import './input-file.scss';

export const InputFile = props => {
  const { className, onChange, children } = props;

  return (
    <React.Fragment>
      <label className={`inputfile ${className}`} htmlFor="file">
        <input
          className="inputfile"
          id="file"
          type="file"
          onChange={e => onChange(e)}
        />
        {children}
      </label>
    </React.Fragment>
  );
};

InputFile.defaultProps = {
  className: null
};

InputFile.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};
