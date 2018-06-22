import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import ReactGA from 'react-ga';

import { configureStore } from './redux/configureStore';
import App from './app/app';
import { ConnectedFeatureToggleProvider } from './components/connected-feature-toggle-provider';

if (window.location.hostname.indexOf('fellesdatakatalog.brreg.no') !== -1) {
  ReactGA.initialize('UA-110098477-1'); // prod
  ReactGA.set({ anonymizeIp: true });
} else if (
  window.location.hostname.indexOf('fellesdatakatalog.tt1.brreg.no') !== -1
) {
  ReactGA.initialize('UA-110098477-2'); // tt1
  ReactGA.set({ anonymizeIp: true });
} else if (window.location.hostname.indexOf('localhost') !== -1) {
  ReactGA.initialize('UA-41886511-1'); // localhost
  ReactGA.set({ anonymizeIp: true });
}

/**
 * @return {null}
 */
function Analytics(props) {
  if (
    window.location.hostname.indexOf('fellesdatakatalog.brreg.no') !== -1 ||
    window.location.hostname.indexOf('fellesdatakatalog.tt1.brreg.no') !== -1 ||
    window.location.hostname.indexOf('localhost') !== -1
  ) {
    ReactGA.set({ page: props.location.pathname + props.location.search });
    ReactGA.pageview(props.location.pathname + props.location.search);
  }
  return null;
}

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedFeatureToggleProvider>
      <BrowserRouter>
        <div className="d-flex flex-column site">
          <div className="site-content d-flex flex-column">
            <Route path="/" component={Analytics} />
            <Route path="/" component={App} />
          </div>
        </div>
      </BrowserRouter>
    </ConnectedFeatureToggleProvider>
  </Provider>,
  document.getElementById('root')
);
