import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class DistributionFormat extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const formatClass = cx(
      'fdk-label-distribution',
      'fdk-bg-green2',
      {
        'fdk-button-format-inactive': this.props.inactive,
        'fdk-button-format-active': this.props.active
      }
    );
    return (
      <div className={formatClass}>
        <i className="fa fa-cogs fdk-fa-left"/>
        {this.props.type &&
        <strong className="fdk-distribution-format">
          {this.props.type}
          </strong>
        }
        {this.props.text}
      </div>
    );
  }
}

DistributionFormat.defaultProps = {
  type: null,
  text: null
};

DistributionFormat.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string
};
