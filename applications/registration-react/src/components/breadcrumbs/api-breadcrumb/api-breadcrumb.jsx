import React from 'react';
import PropTypes from 'prop-types';
import { getTranslateText } from '../../../lib/translateText';

export const ApiBreadcrumb = props => {
  const { apiItem } = props;
  return <span>{getTranslateText(apiItem && apiItem.title)}</span>;
};

ApiBreadcrumb.defaultProps = {
  apiItem: null
};

ApiBreadcrumb.propTypes = {
  apiItem: PropTypes.object
};
