import React from 'react';
import PropTypes from 'prop-types';

const renderSpatials = spatials => {
  return spatials.map(spatial => spatial.uri).join(', ');
};

const TagsInputFieldArrayReadOnly = ({ input }) => {
  return <div className="pl-3">{renderSpatials(input.value)}</div>;
};

TagsInputFieldArrayReadOnly.propTypes = {
  input: PropTypes.object.isRequired
};

export default TagsInputFieldArrayReadOnly;
