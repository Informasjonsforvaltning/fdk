import React from 'react';
import { Route, Switch } from 'react-router';

import { LoginPage } from '../pages/login-page/login-page';
import { ProtectedRoute } from '../app-protected-route/app-protected-route.component';
import { CatalogsPage } from '../pages/catalogs-page/catalogs-page';
import { DatasetsListPage } from '../pages/dataset-list-page/dataset-list-page';
import { DatasetRegistrationPage } from '../pages/dataset-registration-page/dataset-registration-page';
import { ConnectedAPIListPage } from '../pages/api-list-page/connected-api-list-page';
import { ConnectedApiImportPage } from '../pages/api-import-page/connected-api-import-page';
import { ApiRegistrationPage } from '../pages/api-registration-page/api-registration-page';

export const Routes = () => (
  <Switch>
    <Route
      exact
      path="/loggedOut"
      render={props => <LoginPage {...props} loggedOut />}
    />
    <Route exact path="/loggin" render={props => <LoginPage {...props} />} />
    <ProtectedRoute exact path="/" component={CatalogsPage} />
    <ProtectedRoute
      exact
      path="/catalogs/:catalogId/datasets"
      component={DatasetsListPage}
    />
    <ProtectedRoute
      exact
      path="/catalogs/:catalogId/datasets/:datasetId"
      component={DatasetRegistrationPage}
    />
    <ProtectedRoute
      exact
      path="/catalogs/:catalogId/apis"
      component={ConnectedAPIListPage}
    />
    <ProtectedRoute
      exact
      path="/catalogs/:catalogId/apis/import"
      component={ConnectedApiImportPage}
    />
    <ProtectedRoute
      exact
      path="/catalogs/:catalogId/apis/:apiId"
      component={ApiRegistrationPage}
    />
  </Switch>
);
