import React from 'react';
import { NavLink } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

import { DatasetBreadcrumb } from './dataset-breadcrumb/dataset-breadcrumb';
import { ApiBreadcrumb } from './api-breadcrumb/api-breadcrumb';
import { ConceptBreadcrumb } from './concept-breadcrumb/concept-breadcrumb';
import { PathNameBreadcrumb } from './pathname-breadcrumb/pathname-breadcrumb';
import './breadcrumbs.scss';

// define some custom breadcrumbs for certain routes (optional)
const routes = [
  { path: '/', breadcrumb: <PathNameBreadcrumb pathName="home" /> },
  { path: '/datasets/:id', breadcrumb: DatasetBreadcrumb },
  { path: '/apis/:id', breadcrumb: ApiBreadcrumb },
  { path: '/concepts/:id', breadcrumb: ConceptBreadcrumb },
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
              {index < breadcrumbs.length - 1 && (
                <React.Fragment>
                  <NavLink to={breadcrumb.props.match.url}>
                    {breadcrumb}
                  </NavLink>
                  <i className="fa fa-angle-right fdk-fa-path" />
                </React.Fragment>
              )}
              {index === breadcrumbs.length - 1 && breadcrumb}
            </span>
          ))}
        </p>
      </div>
    );
  }
  return null;
};

export const Breadcrumbs = withBreadcrumbs(routes, options)(PureBreadcrumbs);
