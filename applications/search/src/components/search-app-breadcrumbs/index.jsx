import React from 'react';
import { NavLink } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

import PureDatasetBreadcrumb from '../search-app-breadcrumbs-dataset';
import PurePathNameBreadcrumb from '../search-app-breadcrumbs-pathname';

// define some custom breadcrumbs for certain routes (optional)
const routes = [
  { path: '/', breadcrumb: <PurePathNameBreadcrumb pathName="home" /> },
  { path: '/datasets/:id', breadcrumb: PureDatasetBreadcrumb },
  { path: '/about', breadcrumb: <PurePathNameBreadcrumb pathName="about" /> },
  {
    path: '/about-registration',
    breadcrumb: <PurePathNameBreadcrumb pathName="aboutRegistration" />
  },
  {
    path: '/reports',
    breadcrumb: <PurePathNameBreadcrumb pathName="reports" />
  }
];

const options = {
  disableDefaults: true,
  excludePaths: []
};

// map & render your breadcrumb components however you want.
// each `breadcrumb` has the props `key`, `location`, and `match` included!
export const Breadcrumbs = ({ breadcrumbs }) => {
  if (breadcrumbs && breadcrumbs.length > 1) {
    return (
      <div className="col-xs-12">
        <p className="fdk-p-path">
          {breadcrumbs.map((breadcrumb, index) => (
            <span key={breadcrumb.key}>
              <NavLink to={breadcrumb.props.match.url}>{breadcrumb}</NavLink>
              {index < breadcrumbs.length - 1 && (
                <i className="fa fa-angle-right fdk-fa-path" />
              )}
            </span>
          ))}
        </p>
      </div>
    );
  }
  return null;
};

export default withBreadcrumbs(routes, options)(Breadcrumbs);
