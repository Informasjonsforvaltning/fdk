import React from 'react';
import PropTypes from 'prop-types';

const LinkReadonlyField = ({ input }) => (
  <a className="pl-3" href={input.value}>
    {input.value}
  </a>
);

LinkReadonlyField.defaultProps = {
  input: null
};

LinkReadonlyField.propTypes = {
  input: PropTypes.object
};

export default LinkReadonlyField;
