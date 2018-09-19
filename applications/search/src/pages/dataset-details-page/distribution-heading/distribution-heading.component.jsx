import React from 'react';
import PropTypes from 'prop-types';
import './distribution-heading.component.scss';

export const DistributionHeading = props => {
  const { title } = props;
  if (!title) {
    return null;
  }
  return (
    <div className="fdk-distribution-heading" name={title}>
      <h3>{title}</h3>
    </div>
  );
};

DistributionHeading.defaultProps = {
  title: null
};

DistributionHeading.propTypes = {
  title: PropTypes.string
};
