import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Collapse } from 'reactstrap';

export default class FormTemplateDescription extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const { title, values, syncErrors } = this.props;
    const collapseClass = cx('fdk-reg_collapse', {
      'fdk-reg_collapse_open': this.state.collapse
    });
    const collapseIconClass = cx('fa', 'fa-2x', 'mr-2', {
      'fa-angle-down': !this.state.collapse,
      'fa-angle-up': this.state.collapse
    });
    return (
      <div className={collapseClass}>
        <button
          className="d-flex justify-content-between p-0 w-100"
          onClick={this.toggle}
        >
          <div>
            <div className="d-flex">
              <i className={collapseIconClass} />
              <h2 className="mb-0">{title}</h2>
            </div>
            {!this.state.collapse &&
              values && (
                <div className="d-flex text-left fdk-text-size-small fdk-color3">
                  <i className="fa fa-2x fa-angle-down mr-2 visibilityHidden" />
                  {values}
                </div>
              )}
          </div>
          {syncErrors && (
            <div>
              <i className="fa fa-exclamation-triangle fdk-color-red" />
            </div>
          )}
        </button>
        <Collapse className="mt-3" isOpen={this.state.collapse}>
          {this.props.children}
        </Collapse>
      </div>
    );
  }
}

FormTemplateDescription.defaultProps = {
  values: null,
  title: null,
  syncErrors: false,
  children: null
};

FormTemplateDescription.propTypes = {
  values: PropTypes.string,
  title: PropTypes.string,
  syncErrors: PropTypes.bool,
  children: PropTypes.object
};
