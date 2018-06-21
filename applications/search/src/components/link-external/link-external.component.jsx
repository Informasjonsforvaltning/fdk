import React from 'react';
import PropTypes from 'prop-types';

export const LinkExternal = props => (
  <a href={props.uri}>
    {props.prefLabel}
    <i className="fa fa-external-link fdk-fa-right" />
  </a>
);

LinkExternal.defaultProps = {
  uri: '',
  prefLabel: ''
};

LinkExternal.propTypes = {
  uri: PropTypes.string,
  prefLabel: PropTypes.string
};
