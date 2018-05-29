import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export const DistributionFormat = props => {
  const { code, type, text } = props;
  const formatClass = cx('fdk-label-distribution mr-2', {
    'fdk-label-distribution-offentlig': code === 'PUBLIC',
    'fdk-label-distribution-begrenset': code === 'RESTRICTED',
    'fdk-label-distribution-skjermet': code === 'NON-PUBLIC'
  });

  // <i className="fa fa-cogs fdk-fa-left" /> TYPE ICON

  return (
    <div className={formatClass}>
      {type && (
        <span>
          <strong className="fdk-distribution-format">{type}</strong>
        </span>
      )}
      {text}
    </div>
  );
};

DistributionFormat.defaultProps = {
  code: 'PUBLIC',
  type: null,
  text: null
};

DistributionFormat.propTypes = {
  code: PropTypes.string,
  type: PropTypes.string,
  text: PropTypes.string
};

export default DistributionFormat;
