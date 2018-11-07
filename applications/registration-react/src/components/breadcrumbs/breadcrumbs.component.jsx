import React from 'react';
import { NavLink } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import PropTypes from 'prop-types';

import { PathNameBreadcrumb } from './pathname-breadcrumb/pathname-breadcrumb';
import { ApiDescriptionBreadcrumb } from './api-description-breadcrumb/api-description-breadcrumb';
import { DatasetBreadcrumb } from './dataset-breadcrumb/dataset-breadcrumb';
import './breadcrumbs.scss';

// define some custom breadcrumbs for certain routes (optional)
const routes = [
  { path: '/', breadcrumb: <PathNameBreadcrumb pathName="home" /> },
  {
    path: '/catalogs/:catalogId/apis',
    breadcrumb: <PathNameBreadcrumb pathName="API-descriptions" />
  },
  {
    path: '/catalogs/:catalogId/datasets',
    breadcrumb: <PathNameBreadcrumb pathName="datasets" />
  },
  {
    path: '/catalogs/:catalogId/apis/import',
    breadcrumb: <PathNameBreadcrumb pathName="Register a new API-description" />
  },
  {
    path: '/catalogs/:catalogId/apis/:id',
    breadcrumb: ApiDescriptionBreadcrumb
  },
  {
    path: '/catalogs/:catalogId/datasets/:id',
    breadcrumb: DatasetBreadcrumb
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
      <div className="container">
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
      </div>
    );
  }
  return null;
};

PureBreadcrumbs.propTypes = {
  breadcrumbs: PropTypes.array.isRequired
};
export const Breadcrumbs = withBreadcrumbs(routes, options)(PureBreadcrumbs);
