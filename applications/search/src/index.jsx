import 'babel-polyfill';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import SearchPage from './containers/search-results';
import DetailsPage from './containers/search-detailspage';
import AboutPage from './containers/search-about';
import GetStartedPage from './containers/search-getstarted-article';
import ReportsPage from './containers/reports';
import App from './containers/app';
// import getStarted from '../static/getStarted.json';

function handleUpdate() {
  const {
    action
  } = this.state.location;

  if (action === 'PUSH') {
    window.scrollTo(0, 0);
  }
}

const routes =
  (
    <Route path="/" component={App}>
      <Route path="/datasets" component={SearchPage} />
      <IndexRoute component={SearchPage} />
      <Route path="/datasets/(:id)" component={DetailsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/about-registration" component={GetStartedPage} />
      <Route path="/reports" component={ReportsPage} />
    </Route>
  );

ReactDOM.render((
  <Router history={browserHistory} onUpdate={handleUpdate}>
    {routes}
  </Router>
), document.getElementById('root'));
