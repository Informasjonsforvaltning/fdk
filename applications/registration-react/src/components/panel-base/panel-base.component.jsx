import React from 'react';
import PropTypes from 'prop-types';
import './panel-base.scss';

export const PanelBase = props => {
  const { children } = props;

  return <div className="panel-base">{children}</div>;
};

PanelBase.propTypes = {
  children: PropTypes.node.isRequired
};
