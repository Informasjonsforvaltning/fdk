import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export const AlertMessage = props => {
  const { type, children } = props;
  if (!(type && children)) {
    return null;
  }
  const alertClassnames = cx('alert', 'pt-3', 'pb-3', 'mt-3', {
    'alert-success': type === 'success',
    'alert-warning': type === 'warning',
    'alert-danger': type === 'danger',
    'alert-info': type === 'info'
  });
  const iconClassnames = cx('fa', 'mr-2', {
    'fa-exclamation-triangle': type === 'danger',
    'fa-check': type === 'success'
  });
  return (
    <div className={alertClassnames}>
      <i className={iconClassnames} />
      <span>{children}</span>
    </div>
  );
};

AlertMessage.propTypes = {
  type: PropTypes.oneOf(['success', 'warning', 'danger', 'info']).isRequired,
  children: PropTypes.node.isRequired
};
