import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  fetchUserIfNeeded
} from '../../actions/index';
import '../../assets/style/main.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(fetchUserIfNeeded());
  }
  render () {
    const { userItem } = this.props;
    return (
      <div className="site-content">
        {this.props.children}
        {!userItem &&
        <div>Logg inn</div>
        }
      </div>
    )
  }
}

App.defaultProps = {

};

App.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps({ user }) {
  const { userItem } = user || {
    userItem: null
  }

  return {
    userItem
  };
}

export default connect(mapStateToProps)(App);
