import * as React from "react";
import * as ReactDOM from "react-dom";
import {SearchPage} from "./containers/search-resultpage/SearchPage";
import {App} from "./AppPage";
import { Router, Link, Route, browserHistory, IndexRoute } from 'react-router'

const Home = () => {
  return (
    <div>
      <Link to="search">Go to Search</Link>
    </div>
  )
}

const routes =
  (
    <Route patch="/" component={App}>
    <Route path="/datasets" component={SearchPage}>
      <Route path="*" component={SearchPage}/>
      <IndexRoute component={SearchPage}/>
    </Route>
    </Route>
  );

ReactDOM.render((
<Router history={browserHistory}>
  {routes}
</Router>
), document.getElementById('root'));

