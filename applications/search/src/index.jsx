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

const ReactGA = require('react-ga');


if (window.location.hostname.indexOf('fellesdatakatalog.brreg.no') !== -1) {
  ReactGA.initialize('UA-110098477-1'); // prod
  ReactGA.set({ anonymizeIp: true });
} else if (window.location.hostname.indexOf('fellesdatakatalog.tt1.brreg.no') !== -1) {
  ReactGA.initialize('UA-110098477-2'); // tt1
  ReactGA.set({ anonymizeIp: true });
} else if (window.location.hostname.indexOf('localhost') !== -1) {
  ReactGA.initialize('UA-41886511-1'); // localhost
  ReactGA.set({ anonymizeIp: true });
}


function handleUpdate() {
  if ( (window.location.hostname.indexOf('fellesdatakatalog.brreg.no') !== -1) || (window.location.hostname.indexOf('fellesdatakatalog.tt1.brreg.no') !== -1) || (window.location.hostname.indexOf('localhost') !== -1)) {
    ReactGA.set({page: window.location.pathname});
    ReactGA.pageview(window.location.pathname);
  }

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
