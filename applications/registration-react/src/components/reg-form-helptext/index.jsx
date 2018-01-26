import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Collapse } from 'reactstrap';

import './index.scss';

export default class Helptext extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false, status: 'Closed' };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const collapseClass = cx(
      'fa',
      'fdk-fa-left',
      {
        "fa-angle-double-down": !this.state.collapse,
        "fa-angle-double-up": this.state.collapse,
      }
    )

    const shortTextClass = cx(
      'm-0',
      {
        'text-ellipsis': !this.state.collapse
      }
    );
    const { title, required, helptextItems} = this.props;
    const { id, shortdesc, description, uri} = helptextItems;

    const resolvedDescription = description.nb.replace(new RegExp('\n', 'g'), "<br />");

    return (
      <div className="fdk-reg-helptext mb-2 p-2">
        <div className="d-flex align-items-center">
          <h3>{title}</h3>
          {required &&
          <span className="badge badge-secondary ml-1">
            Obligatorisk
          </span>
          }
        </div>
        <div className="d-md-flex">
          <p className={shortTextClass} dangerouslySetInnerHTML={{__html: (shortdesc && shortdesc.nb) ? shortdesc.nb.replace(new RegExp('\n', 'g'), "<br />") : ''}} />

          <div className="text-left no-padding ml-1 fdk-reg-helptext-more" tabIndex="0" onClick={this.toggle}>
            <i className={collapseClass} />
            Flere anbefalinger
          </div>
        </div>
        <Collapse
          className="mt-3"
          isOpen={this.state.collapse}
        >
          <p dangerouslySetInnerHTML={{__html: (description && description.nb) ? description.nb.replace(new RegExp('\n', 'g'), "<br />") : ''}} />
        </Collapse>
      </div>
    );
  }

}

Helptext.defaultProps = {
  title: '',
  required: false,
  helptextItems: {}
};

Helptext.propTypes = {

};
