import React from 'react';
import PropTypes from 'prop-types';

export const SchemaItem = props => {
  const { title, type, marginLeft } = props;

  if (!(title || type)) {
    return null;
  }

  return (
    <div
      style={{ marginLeft }}
      className="d-flex schema-collapse--item"
      name={title}
    >
      <div className="w-50 pl-0">{title}</div>
      <div className="w-50">{type}</div>
    </div>
  );
};

SchemaItem.defaultProps = {
  title: null,
  type: null,
  marginLeft: null
};

SchemaItem.propTypes = {
  title: PropTypes.string,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  marginLeft: PropTypes.number
};
