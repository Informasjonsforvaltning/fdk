import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import configureStore from './store/configureStore';
import ProtectedRoute from './app-protected-route/app-protected-route.component';
import RegCatalogs from './pages/catalogs-page/catalogs-page';
import RegDatasetsList from './pages/dataset-list-page/dataset-list-page';
import RegDataset from './pages/dataset-registration-page/dataset-registration-page';
import Header from './components/app-header';
import Footer from './components/app-footer';
import LoginDialog from './components/app-login-dialog';

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
      path="/catalogs/:catalogId"
      component={RegDatasetsList}
    />
    <ProtectedRoute
      exact
      path="/catalogs/:catalogId/datasets/:id"
      component={RegDataset}
    />
  </Switch>
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div className="d-flex flex-column site">
        <Header />
        <div className="site-content d-flex flex-column">{routes}</div>
        <Footer />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
