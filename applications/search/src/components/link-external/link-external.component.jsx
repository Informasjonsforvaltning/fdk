import React from 'react';
import PropTypes from 'prop-types';
import { getTranslateText } from '../../lib/translateText';

export const LinkExternal = ({ uri, prefLabel }) => (
  <a href={uri}>
    {getTranslateText(prefLabel)}
    <i className="fa fa-external-link fdk-fa-right" />
  </a>
);

LinkExternal.defaultProps = {
  uri: '',
  prefLabel: {}
};

LinkExternal.propTypes = {
  uri: PropTypes.string,
  prefLabel: PropTypes.object
};
