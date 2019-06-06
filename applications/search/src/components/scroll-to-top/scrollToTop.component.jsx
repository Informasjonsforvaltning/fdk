import React from 'react';
import { withRouter } from 'react-router-dom';

class ScrollToTop extends React.Component {
  componentDidUpdate({ location: prevLocation }) {
    const { location } = this.props;
    if (
      location.pathname !== prevLocation.pathname ||
      location.search !== prevLocation.search
    ) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default withRouter(ScrollToTop);
