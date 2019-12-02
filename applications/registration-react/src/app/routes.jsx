import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { LoginPage } from '../pages/login-page/login-page';
import { ProtectedRoute } from './protected-route.component';
import { CatalogsPage } from '../pages/catalogs-page/catalogs-page';
import { CatalogRoutes } from './catalog-routes';
import { hasOrganizationReadPermission } from '../services/auth/auth-service';
import { AuthResponseHandler } from './auth-response-handler.component';

export const Routes = () => (
  <Switch>
    <Route exact path="/login" component={LoginPage} />
    <Route exact path="/auth_response">
      <AuthResponseHandler
        unAuthenticatedRedirect="/login"
        defaultRedirect="/catalogs"
      />
    </Route>
    <ProtectedRoute exact path="/catalogs" component={CatalogsPage} />
    <ProtectedRoute
      path="/catalogs/:catalogId"
      check={({ catalogId }) => hasOrganizationReadPermission(catalogId)}
      component={CatalogRoutes}
    />
    <Redirect to="/catalogs" />
  </Switch>
);
