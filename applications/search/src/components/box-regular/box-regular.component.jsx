import React from 'react';
import PropTypes from 'prop-types';
import './box-regular.scss';

export const BoxRegular = props => {
  const { title, subText } = props;
  return (
    <div className="box-regular flex-grow-1">
      <div className="fdk-text-strong">{title}</div>
      <div>{subText}</div>
    </div>
  );
};

BoxRegular.defaultProps = {
  title: null,
  subText: null
};

BoxRegular.propTypes = {
  title: PropTypes.string,
  subText: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
