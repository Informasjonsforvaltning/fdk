import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import SearchPage from './containers/search-results/index';
import DetailsPage from './containers/search-details/index';
import App from './containers/app';

const routes =
  (
    <Route path="/" component={App}>
      <Route path="/datasets" component={SearchPage} />
      <IndexRoute component={SearchPage} />
      <Route path="/details" component={DetailsPage} />
    </Route>
  );

ReactDOM.render((
  <Router history={browserHistory}>
    {routes}
  </Router>
), document.getElementById('root'));
