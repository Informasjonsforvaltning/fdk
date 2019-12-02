import React from 'react';
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';

export const Timeout = ({ timeout, onTimeout }) => (
  <IdleTimer
    element={document}
    onIdle={onTimeout}
    timeout={timeout}
    debounce={5000}
  />
);

Timeout.propTypes = {
  timeout: PropTypes.number.isRequired,
  onTimeout: PropTypes.func.isRequired
};
