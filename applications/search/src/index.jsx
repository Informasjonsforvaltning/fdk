import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import SearchPage from './containers/search-results';
import DetailsPage from './containers/search-detailspage';
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
      <IndexRoute component={SearchPage} />
      <Route path="/dataset/(:id)" component={DetailsPage} />
    </Route>
  );

ReactDOM.render((
  <Router history={browserHistory} onUpdate={handleUpdate}>
    {routes}
  </Router>
), document.getElementById('root'));
