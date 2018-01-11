import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import App from './containers/app';


//ReactDOM.render(<App />, document.getElementById('root'));



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
      <Route path="/react" component={App} />
    </Route>
  );

ReactDOM.render(<App />, document.getElementById('root'));

/*
ReactDOM.render((
  <Router history={browserHistory} onUpdate={handleUpdate}>
    {routes}
  </Router>
), document.getElementById('root'));
*/
