import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { DatasetsListPage } from '../pages/dataset-list-page/dataset-list-page';
import { DatasetRegistrationPage } from '../pages/dataset-registration-page/dataset-registration-page';
import { ConnectedAPIListPage } from '../pages/api-list-page/connected-api-list-page';
import { ApiImportPage } from '../pages/api-import-page/api-import-page';
import { ApiRegistrationPage } from '../pages/api-registration-page/api-registration-page';

export const CatalogRoutes = () => (
  <Switch>
    <Route
      exact
      path="/catalogs/:catalogId/datasets"
      component={DatasetsListPage}
    />
    <Route
      exact
      path="/catalogs/:catalogId/datasets/:datasetId"
      component={DatasetRegistrationPage}
    />
    <Route
      exact
      path="/catalogs/:catalogId/apis"
      component={ConnectedAPIListPage}
    />
    <Route
      exact
      path="/catalogs/:catalogId/apis/import"
      component={ApiImportPage}
    />
    <Route
      exact
      path="/catalogs/:catalogId/apis/:apiId"
      component={ApiRegistrationPage}
    />
    <Redirect to="/catalogs" />
  </Switch>
);
