import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch, Router } from 'react-router-dom';

import configureStore from './store/configureStore';
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
