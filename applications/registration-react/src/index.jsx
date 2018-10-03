import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { configureStore } from './redux/configureStore';
import ProtectedRoute from './app-protected-route/app-protected-route.component';
import { ConnectedFeatureToggleProvider } from './components/connected-feature-toggle-provider';
import RegCatalogs from './pages/catalogs-page/catalogs-page';
import { ConnectedDatasetsListPage } from './pages/dataset-list-page/connected-dataset-list-page';
import RegDataset from './pages/dataset-registration-page/dataset-registration-page';
import Header from './components/app-header/app-header.component';
import Footer from './components/app-footer/app-footer.component';
import LoginDialog from './components/app-login-dialog/app-login-dialog.component';

const store = configureStore();

const routes = (
  <Switch>
    <Route
      exact
      path="/loggedOut"
      render={props => <LoginDialog {...props} loggedOut />}
    />
    <Route exact path="/loggin" render={props => <LoginDialog {...props} />} />
    <ProtectedRoute exact path="/" component={RegCatalogs} />
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
      path="/catalogs/:catalogId/apiSpecs"
      component={RegCatalogs}
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
