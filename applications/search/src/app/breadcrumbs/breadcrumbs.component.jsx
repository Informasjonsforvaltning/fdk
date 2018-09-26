import React from 'react';
import { NavLink } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

import { DatasetBreadcrumb } from './dataset-breadcrumb/dataset-breadcrumb';
import { PathNameBreadcrumb } from './pathname-breadcrumb/pathname-breadcrumb';
import './breadcrumbs.scss';

// define some custom breadcrumbs for certain routes (optional)
const routes = [
  { path: '/', breadcrumb: <PathNameBreadcrumb pathName="home" /> },
  { path: '/datasets/:id', breadcrumb: DatasetBreadcrumb },
  { path: '/apis/:id', breadcrumb: DatasetBreadcrumb },
  { path: '/about', breadcrumb: <PathNameBreadcrumb pathName="about" /> },
  {
    path: '/about-registration',
    breadcrumb: <PathNameBreadcrumb pathName="aboutRegistration" />
  },
  {
    path: '/reports',
    breadcrumb: <PathNameBreadcrumb pathName="reports" />
  }
];

const options = {
  disableDefaults: true,
  excludePaths: []
};

// map & render your breadcrumb components however you want.
// each `breadcrumb` has the props `key`, `location`, and `match` included!
const PureBreadcrumbs = ({ breadcrumbs }) => {
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

export const Breadcrumbs = withBreadcrumbs(routes, options)(PureBreadcrumbs);
