import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { LoginPage } from '../pages/login-page/login-page';
import { ProtectedRoute } from './protected-route.component';
import { CatalogsPage } from '../pages/catalogs-page/catalogs-page';
import { CatalogRoutes } from './catalog-routes';
import { isAuthenticated } from '../auth/auth-service';

export const Routes = () => (
  <Switch>
    <Route exact path="/login" component={LoginPage} />
    <Redirect exact from="/" to="/catalogs" />
    <ProtectedRoute
      exact
      path="/catalogs"
      check={() => isAuthenticated()}
      component={CatalogsPage}
    />
    <ProtectedRoute
      path="/catalogs/:catalogId"
      check={() => isAuthenticated()}
      component={CatalogRoutes}
    />
  </Switch>
);
