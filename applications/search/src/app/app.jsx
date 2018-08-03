import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import localization from '../lib/localization';
import { ConnectedSearchPage } from '../pages/search-page/connected-search-page';
import { ConnectedDatasetDetailsPage } from '../pages/dataset-details-page/connected-dataset-details-page';
import { AboutPage } from '../pages/about-page/about-page.component';
import { ArticlePage } from '../pages/article-page/article-page.component';
import { Breadcrumbs } from './breadcrumbs/breadcrumbs.component';
import { ConnectedAppNavBar } from './app-nav-bar/connected-app-nav-bar';
import { ConnectedDatasetsReportPage } from '../pages/datasets-report-page/connected-datasets-report-page';

import '../assets/css/bootstrap-override.scss';
import './styles';

export function App(props) {
  // react-localization is a stateful library, so we set the required language on each full-app render
  // and full-render app each time when the language is changed
  localization.setLanguage(props.language);

  return (
    <div>
      <div>
        <a
          id="focus-element"
          className="uu-invisible"
          href={`${location.pathname}#content`}
          aria-hidden="true"
        >
          Hopp til hovedinnhold
        </a>
      </div>
      <div id="skip-link-wrap">
        <a id="skip-link" href={`${location.pathname}#content`}>
          Hopp til hovedinnhold
        </a>
      </div>
      <div className="fdk-header-beta">
        {localization.beta.header}
        <br className="visible-xs visible-sm" />
        {localization.beta.first}
        <a className="white-link" href="mailto:fellesdatakatalog@brreg.no">
          {localization.beta.second}
        </a>{' '}
        {localization.beta.last}
      </div>

      <ConnectedAppNavBar />

      <div className="container">
        <div className="row">
          <Breadcrumbs />
        </div>
      </div>
      <div className="app-routes">
        <Switch>
          <Route exact path="/" component={ConnectedSearchPage} />
          <Route exact path="/api" component={ConnectedSearchPage} />
          <Route exact path="/concepts" component={ConnectedSearchPage} />
          <Route
            exact
            path="/datasets/:id"
            component={ConnectedDatasetDetailsPage}
          />
          <Route
            exact
            path="/reports"
            component={ConnectedDatasetsReportPage}
          />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/about-registration" component={ArticlePage} />
        </Switch>
      </div>

      <div className="fdk-footer d-md-none">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 text-center mb-2">
              <p className="fdk-p-footer">
                {localization.footer.information_text}
              </p>
            </div>
            <div className="col-sm-12 text-center mb-2">
              <p className="fdk-p-footer">
                <a href="https://www.brreg.no/personvernerklaering/">
                  {localization.footer.information}
                  {localization.footer.privacy}
                  <i className="fa fa-external-link fdk-fa-right" />
                </a>
              </p>
            </div>

            <div className="col-sm-12 text-center mb-2">
              <p className="fdk-p-footer">
                <a href="mailto:fellesdatakatalog@brreg.no">
                  {localization.footer.mail}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fdk-footer d-none d-md-block">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <p className="fdk-p-footer">
                <a href="https://www.brreg.no/personvernerklaering/">
                  {localization.footer.information}
                  <br />
                  {localization.footer.privacy}
                  <i className="fa fa-external-link fdk-fa-right" />
                </a>
              </p>
            </div>
            <div className="col-md-6 text-center">
              <span className="uu-invisible" aria-hidden="false">
                Felles Datakatalog.
              </span>
              <p className="fdk-p-footer">
                {localization.footer.information_text}
              </p>
            </div>
            <div className="col-md-3 text-right">
              <p className="fdk-p-footer">
                <a href="mailto:fellesdatakatalog@brreg.no">
                  <span className="uu-invisible" aria-hidden="false">
                    Mailadresse.
                  </span>
                  {localization.footer.contact}
                  <br />
                  {localization.footer.mail}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

App.propTypes = {
  language: PropTypes.string.isRequired
};
