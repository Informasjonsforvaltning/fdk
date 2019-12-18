import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ProtectedRoute } from './protected-route.component';
import { CatalogsPage } from '../pages/catalogs-page/catalogs-page';
import { CatalogRoutes } from './catalog-routes';
import { authService } from '../services/auth/auth-service';

export const Routes = () => (
  <Switch>
    <Route exact path="/catalogs" component={CatalogsPage} />
    <ProtectedRoute
      path="/catalogs/:catalogId"
      check={({ catalogId }) =>
        authService.hasOrganizationReadPermission(catalogId)
      }
      component={CatalogRoutes}
    />
    <Redirect to="/catalogs" />
  </Switch>
);
