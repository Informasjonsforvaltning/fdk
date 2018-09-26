import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';

import './begrep-collapse.scss';

export class BegrepCollapse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailed: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ detailed: !this.state.detailed });
  }

  render() {
    return (
      <div className="fdk-container-detail fdk-container-detail-begrep">
        <div
          className="fdk-ingress mb-0 fdk-container-begrep"
          role="button"
          tabIndex={0}
          onClick={this.toggle}
          onKeyPress={this.toggle}
        >
          <strong className="float-left">{this.props.prefLabel}:&nbsp;</strong>
          {this.props.note && (
            <i className="fa fa-chevron-down fdk-fa-right float-right" />
          )}
          <div>{this.props.definition}</div>
          <Collapse isOpen={this.state.detailed}>
            <div>{this.props.note}</div>
          </Collapse>
        </div>
      </div>
    );
  }
}

BegrepCollapse.defaultProps = {
  prefLabel: '',
  definition: '',
  note: ''
};

BegrepCollapse.propTypes = {
  prefLabel: PropTypes.string,
  definition: PropTypes.string,
  note: PropTypes.string
};
