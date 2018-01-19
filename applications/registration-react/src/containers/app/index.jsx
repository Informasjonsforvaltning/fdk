import React, {Component} from 'react';
import '../../assets/style/main.scss';

export default class App extends Component {
  render () {
    return (
      <div className="col-12">
        test3
        {this.props.children}
      </div>
    );
  }
}
