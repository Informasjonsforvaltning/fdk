import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import SearchPage from './containers/search-results';
import DetailsPage from './containers/search-detailspage';
import AboutPage from './containers/search-about';
import App from './containers/app';

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
    </Route>
  );

ReactDOM.render((
  <Router history={browserHistory} onUpdate={handleUpdate}>
    {routes}
  </Router>
), document.getElementById('root'));
