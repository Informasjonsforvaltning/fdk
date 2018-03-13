import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { BrowserRouter, Route, Switch, Router } from 'react-router-dom';
import { syncHistoryWithStore, push } from 'react-router-redux';
// import { createHistory } from 'history';
import createHistory from 'history/createBrowserHistory'

import configureStore from './store/configureStore';
import routing from './reducers/routing';
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

const store = configureStore();

const history = createHistory();

// This is all we need to do sync browser history with the location
// state in the store.
// syncHistoryWithStore(history, store, { adjustUrlOnReplay: false });


// store.dispatch(push('/foo'));
// const routerHistory = syncHistoryWithStore(history, store, { adjustUrlOnReplay: true });

/*
const recentLocation = (store.getState().routing || {}).locationBeforeTransitions;
const routerHistory = syncHistoryWithStore(history, store, { adjustUrlOnReplay: false });
const location = history.location;
console.log("location2", JSON.stringify(location));
//history.replace('?tester');
if(recentLocation && recentLocation.pathname) {
  history.replace(recentLocation.pathname);
}

/*
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
  <Provider store={store}>
    <Router history={browserHistory} onUpdate={handleUpdate}>
      {routes}
    </Router>
  </Provider>
), document.getElementById('root'));
*/

/*
const routes =
  (
    <Switch>
      <Route exact path="/" render={(props) => <SearchPage {...props} />} />
      <Route exact path="/datasets" component={SearchPage} />
      <Route exact path="/datasets/:id" component={DetailsPage} />
      <Route exact path="/reports" component={ReportsPage} />
    </Switch>
  );
*/


ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <div className="d-flex flex-column site">
        <div className="site-content d-flex flex-column">
          <Route path="/" component={App} />
        </div>
      </div>
    </BrowserRouter>
  </Provider>
), document.getElementById('root'))

