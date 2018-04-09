import React from 'react';
import { NavLink } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

import localization from '../localization';

// breadcrumbs can be any type of component or string
const UserBreadcrumb = ({ match }) =>
  <span>{match.params.userId}</span>; // use match param userId to fetch/display user name

// define some custom breadcrumbs for certain routes (optional)
const routes = [
  { path: '/', breadcrumb: 'hjem' },
  { path: '/datasets/:id', breadcrumb: 'datasett' },
  { path: '/about', breadcrumb: localization.about.about },
  { path: '/reports', breadcrumb: localization.menu.aboutRegistration }
];

// map & render your breadcrumb components however you want.
// each `breadcrumb` has the props `key`, `location`, and `match` included!
const Breadcrumbs = ({ breadcrumbs }) => (
  <div>
    {breadcrumbs.map((breadcrumb, index) => (
      <span key={breadcrumb.props.key}>
        <NavLink to={breadcrumb.props.match.url}>
          {breadcrumb}
        </NavLink>
        {(index < breadcrumbs.length - 1) && <i> > </i>}
      </span>
    ))}
  </div>
);

export default withBreadcrumbs(routes, { disableDefaults: true })(Breadcrumbs);
