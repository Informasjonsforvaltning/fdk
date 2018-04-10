import React from 'react';
import localization from '../localization';

const PurePathNameBreadcrumb = ({ pathName }) => {
  return (
  <span>{localization.menu[pathName]}</span>
  );
}



export default PurePathNameBreadcrumb;
