import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { configureStore } from './redux/configureStore';
import ProtectedRoute from './app-protected-route/app-protected-route.component';
import { ConnectedFeatureToggleProvider } from './components/connected-feature-toggle-provider';
import { ConnectedCatalogsPage } from './pages/catalogs-page/connected-catalogs-page';
import { ConnectedDatasetsListPage } from './pages/dataset-list-page/connected-dataset-list-page';
import { ConnectedAPIListPage } from './pages/api-list-page/connected-api-list-page';
import { ConnectedAPIRegistrationPage } from './pages/api-registration-page/connected-api-registration-page';
import RegDataset from './pages/dataset-registration-page/dataset-registration-page';
import Header from './components/app-header/app-header.component';
import Footer from './components/app-footer/app-footer.component';
import LoginDialog from './components/app-login-dialog/app-login-dialog.component';
import { ApiImportPage } from './pages/api-import-page/api-import-page';

const store = configureStore();

const routes = (
  <Switch>
    <Route
      exact
      path="/loggedOut"
      render={props => <LoginDialog {...props} loggedOut />}
    />
    <Route exact path="/loggin" render={props => <LoginDialog {...props} />} />
    <ProtectedRoute exact path="/" component={ConnectedCatalogsPage} />
    <ProtectedRoute
      exact
      path="/catalogs/:catalogId/datasets"
      component={ConnectedDatasetsListPage}
    />
    <ProtectedRoute
      exact
      path="/catalogs/:catalogId/datasets/:id"
      component={RegDataset}
    />
    <ProtectedRoute
      exact
      path="/catalogs/:catalogId/apis"
      component={ConnectedAPIListPage}
    />
    <ProtectedRoute
      exact
      path="/catalogs/:catalogId/apis/import"
      component={ApiImportPage}
    />
    <ProtectedRoute
      exact
      path="/catalogs/:catalogId/apis/:id"
      component={ConnectedAPIRegistrationPage}
    />
  </Switch>
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedFeatureToggleProvider>
      <BrowserRouter>
        <div className="d-flex flex-column site">
          <Header />
          <div className="site-content d-flex flex-column">{routes}</div>
          <Footer />
        </div>
      </BrowserRouter>
    </ConnectedFeatureToggleProvider>
  </Provider>,
  document.getElementById('root')
);
