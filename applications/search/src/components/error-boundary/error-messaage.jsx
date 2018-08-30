import React from 'react';

import './error-message.scss';

export const ErrorMessage = props => {
  const { label, errorMessage, details } = props;

  return (
    <div className="error-message">
      <p>
        <strong className="error-message--label">{label}</strong>
      </p>
      <p className="error-message--msg">{errorMessage}</p>
      {details && (
        <details className="error-message--details">{details}</details>
      )}
    </div>
  );
};

ErrorMessage.defaultProps = {
  details: null
};
