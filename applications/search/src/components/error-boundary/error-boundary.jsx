/**
 * An error boundary prevents the entire destruction of the react render
 * process, thus allowing the user to still use functionality that is not
 * directly affected by the error.
 */

import React from 'react';
import { ErrorMessage } from './error-messaage';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      errorObj: {},
      errorInfo: {}
    };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({
      hasError: true,
      errorObj: error,
      errorInfo: info
    });
  }

  render() {
    const { hasError, errorObj, errorInfo } = this.state;
    const { children } = this.props;
    if (!hasError) {
      return children;
    }

    return (
      <ErrorMessage
        label="Something went wrong"
        errorMessage={errorObj && errorObj.toString()}
        details={errorInfo.componentStack}
      />
    );
  }
}
