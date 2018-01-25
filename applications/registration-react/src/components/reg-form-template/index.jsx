import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
import cx from 'classnames';

export default class Example extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const { title } = this.props;
    const collapseClass = cx(
      'fdk-reg_collapse',
      {
        'fdk-reg_collapse_open': this.state.collapse
      }
    )
    const collapseIconClass = cx(
      'fa',
      'fdk-fa-left',
      'fa-2x',
      'mr-2',
      {
        "fa-angle-down": !this.state.collapse,
        "fa-angle-up": this.state.collapse,
      }
    );
    console.log("render");
    return (
      <div className={collapseClass}>
        <button className="d-flex align-items-center text-left no-padding w-100" onClick={this.toggle}>
          <i className={collapseIconClass} />
          <h2 className="mb-0">{ title }</h2>

        </button>
        <Collapse
          className="mt-3"
          isOpen={this.state.collapse}
        >
          {this.props.children}
        </Collapse>
      </div>
    );
  }
}
