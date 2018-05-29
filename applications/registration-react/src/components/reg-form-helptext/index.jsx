import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Collapse } from 'reactstrap';

import localization from '../../utils/localization';
import './index.scss';

export default class Helptext extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle(e) {
    e.preventDefault();
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const collapseClass = cx('fa', 'fdk-fa-left', {
      'fa-angle-double-down': !this.state.collapse,
      'fa-angle-double-up': this.state.collapse
    });

    const shortTextClass = cx('m-0', {
      'text-ellipsis': !this.state.collapse
    });
    const { title, required, helptextItems } = this.props;
    const { shortdesc, description } = helptextItems;

    return (
      <div className="fdk-reg-helptext mb-2 p-2">
        <div className="d-flex align-items-center">
          <h3>{title}</h3>
          {required && (
            <span className="fdk-badge badge badge-secondary ml-2">
              {localization.helptext.required}
            </span>
          )}
        </div>
        {/* eslint-disable react/no-danger */}
        <div className="d-md-flex">
          <p
            className={shortTextClass}
            dangerouslySetInnerHTML={{
              __html:
                shortdesc && shortdesc.nb
                  ? shortdesc.nb.replace(new RegExp('\n', 'g'), '<br />')
                  : ''
            }}
          />

          <button
            className="fdk-btn-no-border text-left no-padding ml-1 fdk-reg-helptext-more align-self-start"
            onClick={e => this.toggle(e)}
          >
            <i className={collapseClass} />
            {localization.helptext.more}
          </button>
        </div>
        <Collapse className="mt-3" isOpen={this.state.collapse}>
          <p
            dangerouslySetInnerHTML={{
              __html:
                description && description.nb
                  ? description.nb.replace(new RegExp('\n', 'g'), '<br />')
                  : ''
            }}
          />
        </Collapse>
        {/* eslint-enable react/no-danger */}
      </div>
    );
  }
}

Helptext.defaultProps = {
  title: '',
  required: false,
  helptextItems: null
};

Helptext.propTypes = {
  title: PropTypes.string,
  required: PropTypes.bool,
  helptextItems: PropTypes.object
};
