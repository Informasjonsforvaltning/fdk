import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { LoginPage } from '../pages/login-page/login-page';
import { ProtectedRoute } from '../app-protected-route/app-protected-route.component';
import { CatalogsPage } from '../pages/catalogs-page/catalogs-page';
import { CatalogRoutes } from './catalog-routes';

export const Routes = () => (
  <Switch>
    <Route
      exact
      path="/loggedOut"
      render={props => <LoginPage {...props} loggedOut />}
    />
    <Route exact path="/login" render={props => <LoginPage {...props} />} />
    <Redirect exact from="/" to="/catalogs" />
    <ProtectedRoute exact path="/catalogs" component={CatalogsPage} />
    <ProtectedRoute path="/catalogs/:catalogId" component={CatalogRoutes} />
  </Switch>
);
