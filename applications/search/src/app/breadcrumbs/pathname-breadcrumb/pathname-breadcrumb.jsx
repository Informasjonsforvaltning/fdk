import React from 'react';
import localization from '../../../lib/localization';

export const PathNameBreadcrumb = ({ pathName }) => (
  <span>{localization.menu[pathName]}</span>
);
