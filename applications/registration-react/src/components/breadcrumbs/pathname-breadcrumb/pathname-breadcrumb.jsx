import React from 'react';
import PropTypes from 'prop-types';
import localization from '../../../services/localization';

export const PathNameBreadcrumb = ({ pathName }) => (
  <span>{localization.breadcrumbs[pathName]}</span>
);

PathNameBreadcrumb.defaultProps = {
  pathName: null
};

PathNameBreadcrumb.propTypes = {
  pathName: PropTypes.string
};
