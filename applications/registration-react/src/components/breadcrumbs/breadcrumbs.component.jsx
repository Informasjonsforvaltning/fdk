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
  {
    path: '/',
    breadcrumb: props => <PathNameBreadcrumb pathName="home" {...props} />
  },
  {
    path: '/catalogs/:catalogId/apis',
    breadcrumb: props => (
      <PathNameBreadcrumb pathName="API-descriptions" {...props} />
    )
  },
  {
    path: '/catalogs/:catalogId/datasets',
    breadcrumb: props => <PathNameBreadcrumb pathName="Datasets" {...props} />
  },
  {
    path: '/catalogs/:catalogId/apis/import',
    breadcrumb: props => (
      <PathNameBreadcrumb
        pathName="Register a new API-description"
        {...props}
      />
    )
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
                  <>
                    <NavLink to={breadcrumb.match.url}>
                      {breadcrumb.breadcrumb}
                    </NavLink>
                    <i className="fa fa-angle-right fdk-fa-path" />
                  </>
                )}
                {index === breadcrumbs.length - 1 && breadcrumb.breadcrumb}
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
