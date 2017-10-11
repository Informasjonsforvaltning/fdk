import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class DistributionFormat extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const formatClass = cx(
      'fdk-label-distribution',
      {
        'fdk-bg-green2': this.props.code === 'PUBLIC',
        'fdk-bg-yellow2': this.props.code === 'RESTRICTED',
        'fdk-bg-red2': this.props.code === 'NON-PUBLIC'
      }
    );
    return (
      <div className={formatClass}>
        {this.props.type &&
        <span>
          <i className="fa fa-cogs fdk-fa-left" />
          <strong className="fdk-distribution-format">
            {this.props.type}
          </strong>
        </span>
        }
        {this.props.text}
      </div>
    );
  }
}

DistributionFormat.defaultProps = {
  code: 'PUBLIC',
  type: null,
  text: null
};

DistributionFormat.propTypes = {
  code: PropTypes.string,
  type: PropTypes.string,
  text: PropTypes.string
};
