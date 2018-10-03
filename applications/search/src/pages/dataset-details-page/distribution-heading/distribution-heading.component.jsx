import React from 'react';
import PropTypes from 'prop-types';
import './distribution-heading.component.scss';

export const DistributionHeading = props => {
  const { title, itemsCount } = props;
  if (!title) {
    return null;
  }
  return (
    <div className="fdk-distribution-heading" name={title}>
      <h3>
        {title}
        {itemsCount && ` (${itemsCount})`}
      </h3>
    </div>
  );
};

DistributionHeading.defaultProps = {
  title: null,
  itemsCount: null
};

DistributionHeading.propTypes = {
  title: PropTypes.string,
  itemsCount: PropTypes.number
};
