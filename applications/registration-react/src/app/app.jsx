import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { ProtectedRoute } from '../app-protected-route/app-protected-route.component';
import { ConnectedCatalogsPage } from '../pages/catalogs-page/connected-catalogs-page';
import { DatasetsListPage } from '../pages/dataset-list-page/dataset-list-page';
import { ConnectedAPIListPage } from '../pages/api-list-page/connected-api-list-page';
import { ApiRegistrationPage } from '../pages/api-registration-page/api-registration-page';
import { DatasetRegistrationPage } from '../pages/dataset-registration-page/dataset-registration-page';
import { AppHeader } from '../components/app-header/app-header.component';
import { Breadcrumbs } from '../components/breadcrumbs/breadcrumbs.component';
import Footer from '../components/app-footer/app-footer.component';
import { LoginPage } from '../pages/login-page/login-page';
import { ConnectedApiImportPage } from '../pages/api-import-page/connected-api-import-page';

const Routes = (
  <Switch>
    <Route
      exact
      path="/loggedOut"
      render={props => <LoginPage {...props} loggedOut />}
    />
    <Route exact path="/loggin" render={props => <LoginPage {...props} />} />
    <ProtectedRoute exact path="/" component={ConnectedCatalogsPage} />
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

export const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column site theme-fdk">
      <AppHeader />
      <Breadcrumbs />
      <div className="site-content d-flex flex-column pt-5">{Routes}</div>
      <Footer />
    </div>
  </BrowserRouter>
);
