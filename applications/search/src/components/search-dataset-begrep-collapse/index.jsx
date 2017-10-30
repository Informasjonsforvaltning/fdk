import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';

import './index.scss';

export default class BegrepCollapse extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
        <div className="fdk-ingress fdk-margin-bottom-no fdk-container-begrep" role="button" tabIndex={0} onClick={this.toggle}>
          <strong className="pull-left">{this.props.prefLabel}:&nbsp;</strong>
          {this.props.note &&
          <i className="fa fa-chevron-down fdk-fa-right fdk-float-right"/>
          }
          <div>
            {this.props.definition}
          </div>
          <Collapse in={this.state.detailed}>
            <div>
              {this.props.note}
            </div>
          </Collapse>
        </div>
      </div>
    );
  }
}

BegrepCollapse.defaultProps = {
  prefLabel: '',
  definition: '',
  note: '',
  source: ''
};

BegrepCollapse.propTypes = {
  prefLabel: PropTypes.string,
  definition: PropTypes.string,
  note: PropTypes.string,
  source: PropTypes.string
};
