import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';
import cx from 'classnames';

import localization from '../../components/localization';

export default class DatasetBegrep extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
        <div className="fdk-ingress fdk-margin-bottom-no" onClick={this.toggle}>
          <strong className="pull-left">Jordsmonn:&nbsp;</strong>
          <i className="fa fa-chevron-down fdk-fa-right fdk-float-right" />
          {!this.state.detailed &&
            <div>
              {this.props.description.substr(0, 30)}...
            </div>
          }

          <Collapse in={this.state.detailed}>
            <div>
              {this.props.description}
            </div>
          </Collapse>
        </div>
      </div>

    );
  }
}

DatasetBegrep.defaultProps = {
  title: null,
  description: null
};

DatasetBegrep.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};
