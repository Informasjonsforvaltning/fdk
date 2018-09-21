import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Collapse } from 'reactstrap';

import localization from '../../../utils/localization';
import './form-template.scss';

export default class FormTemplate extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const { title, backgroundBlue, values, syncErrors, required } = this.props;
    const collapseClass = cx('fdk-reg_collapse', {
      'fdk-reg_backgroundDefault': !backgroundBlue,
      'fdk-reg_backgroundBlue': backgroundBlue,
      'fdk-reg_collapse_open': this.state.collapse
    });
    const buttonClass = cx('fdk-collapseButton', 'fdk-btn-no-border', 'w-100', {
      'p-0': !backgroundBlue
    });
    const collapseIconClass = cx('fa', 'fa-2x', 'mr-2', {
      'fa-angle-down': !this.state.collapse,
      'fa-angle-up': this.state.collapse
    });
    const collapseContentClass = cx('mt-3', {
      'fdk-collapseContent': backgroundBlue
    });
    return (
      <div className={collapseClass}>
        <button className={buttonClass} onClick={this.toggle}>
          <div className="d-flex align-items-center">
            <i className={collapseIconClass} />
            <h2 className="mb-0 text-ellipsis">{title}</h2>
            {required && (
              <span className="fdk-badge badge badge-secondary ml-2 fdk-text-size-small">
                {localization.helptext.required}
              </span>
            )}
            {syncErrors && (
              <div className="d-flex justify-content-end fdk-syncError-icon">
                <i className="fa fa-exclamation-triangle fdk-color-red ml-2" />
              </div>
            )}
          </div>
          {!this.state.collapse &&
            values && (
              <div className="d-flex text-left fdk-text-size-small fdk-color3">
                <i className="fa fa-2x fa-angle-down mr-2 visibilityHidden" />
                <span className="text-ellipsis">{values}</span>
              </div>
            )}
        </button>
        <Collapse className={collapseContentClass} isOpen={this.state.collapse}>
          {this.props.children}
        </Collapse>
      </div>
    );
  }
}

FormTemplate.defaultProps = {
  values: null,
  title: null,
  backgroundBlue: false,
  syncErrors: false,
  required: false,
  children: null
};

FormTemplate.propTypes = {
  values: PropTypes.string,
  title: PropTypes.string,
  backgroundBlue: PropTypes.bool,
  syncErrors: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array
  ]),
  required: PropTypes.bool,
  children: PropTypes.object
};
