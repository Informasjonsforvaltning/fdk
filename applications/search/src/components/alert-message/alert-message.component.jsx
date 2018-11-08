import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export const AlertMessage = props => {
  const { type, classNames, children } = props;
  if (!(type && children)) {
    return null;
  }
  const alertClassnames = cx('alert', 'pt-3', 'pb-3', classNames, {
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
    <div className={alertClassnames} role="alert">
      <i className={iconClassnames} />
      <span>{children}</span>
    </div>
  );
};

AlertMessage.defaultProps = {
  classNames: null
};

AlertMessage.propTypes = {
  type: PropTypes.oneOf(['success', 'warning', 'danger', 'info']).isRequired,
  classNames: PropTypes.string,
  children: PropTypes.node.isRequired
};
