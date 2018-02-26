import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import configureStore from './store/configureStore';
import RegCatalogs from './containers/reg-catalogs';
import RegDatasetsList from './containers/reg-datasets-list';
import RegDataset from './containers/reg-dataset';
import Header from './components/app-header';
import Footer from './components/app-footer';

const store = configureStore();

/*
const routes =
  (
    <Switch>
      <Route path="/react2" component={RegCatalogs} />
      <Route path="/react/catalogs/:catalogId" component={RegDatasetsList} />
      <Route path="/react/catalogs/:catalogId/datasets/:id" component={RegDataset} />
    </Switch>
  );
*/

const routes =
  (
    <Switch>
      <Route exact path="/" component={RegCatalogs} />
      <Route exact path="/catalogs/:catalogId" component={RegDatasetsList} />
      <Route exact path="/catalogs/:catalogId/datasets/:id" component={RegDataset} />
    </Switch>
  );

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <div className="d-flex flex-column site">
        <Header />
        <div className="site-content">
          {routes}
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  </Provider>
), document.getElementById('root'))
