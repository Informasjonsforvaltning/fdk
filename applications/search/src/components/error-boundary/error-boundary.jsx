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
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { errorObj, errorInfo } = this.state;

    return (
      <ErrorMessage
        label="Something went wrong"
        errorMessage={errorObj && errorObj.toString()}
        details={errorInfo.componentStack}
      />
    );
  }
}
