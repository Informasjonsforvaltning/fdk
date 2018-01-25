/*
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

//ReactDOM.render(<App />, document.getElementById('root'));


ReactDOM.render((
  <Router history={browserHistory} onUpdate={handleUpdate}>
    {routes}
  </Router>
), document.getElementById('root'));
*/

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { BrowserRouter, Route, Switch, Router, Link } from 'react-router-dom'

import configureStore from './store/configureStore';
import App from './containers/app';
import Dataset from './containers/dataset';
import RegDataset from './containers/reg-dataset';
import Header from './components/app-header';
import Footer from './components/app-footer';

const store = configureStore();

const App2 = () => (
  <div>
    driver å tester
  </div>
)

const routes =
  (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/react" component={RegDataset} />
      <Route path="/react/catalogs/(:catalogId)/datasets/(:id)" component={RegDataset} />
      <Route path="/react2" component={Dataset} />
    </Switch>
  );

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Header/>
        {routes}
      <Footer/>
      </div>
    </BrowserRouter>
  </Provider>
), document.getElementById('root'))
