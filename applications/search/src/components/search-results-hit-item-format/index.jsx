import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class SearchHitFormat extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const formatClass = cx(
      'fdk-button-format',
      {
        'fdk-button-format-inactive': this.props.inactive,
        'fdk-button-format-active': this.props.active
      }
    );
    return (
      <div className={formatClass}>
        <i className="fa fa-download fdk-fa-left" />
        {this.props.text}
      </div>
    );
  }
}

SearchHitFormat.defaultProps = {
  active: false,
  inactive: true,
  text: null
};

SearchHitFormat.propTypes = {
  active: PropTypes.bool,
  inactive: PropTypes.bool,
  text: PropTypes.string
};
