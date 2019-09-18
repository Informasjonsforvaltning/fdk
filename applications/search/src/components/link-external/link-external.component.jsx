import React from 'react';
import PropTypes from 'prop-types';
import { getTranslateText } from '../../lib/translateText';

export const LinkExternal = ({ uri, prefLabel, openInNewTab }) => (
  <a href={uri} target={openInNewTab ? '_blank' : '_self'}>
    {getTranslateText(prefLabel)}
    <i className="fa fa-external-link fdk-fa-right" />
  </a>
);

LinkExternal.defaultProps = {
  uri: '',
  prefLabel: {},
  openInNewTab: false
};

LinkExternal.propTypes = {
  uri: PropTypes.string,
  prefLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  openInNewTab: PropTypes.bool
};
