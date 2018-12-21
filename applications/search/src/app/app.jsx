import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { detect } from 'detect-browser';
import cx from 'classnames';

import localization from '../lib/localization';
import { SearchBoxWithState } from './search-box/search-box.component';
import { ResultsTabs } from './results-tabs/results-tabs.component';
import { ConnectedSearchPage } from '../pages/search-page/connected-search-page';
import { ConnectedDatasetDetailsPage } from '../pages/dataset-details-page/connected-dataset-details-page';
import { ConnectedApiDetailsPage } from '../pages/api-details-page/connected-api-details-page';
import { ConnectedConceptDetailsPage } from '../pages/concept-details-page/connected-concept-details-page';
import { ConnectedConceptComparePage } from '../pages/concept-compare-page/connected-concept-compare-page';
import { AboutPage } from '../pages/about-page/about-page.component';
import { ArticlePage } from '../pages/article-page/article-page.component';
import { Breadcrumbs } from './breadcrumbs/breadcrumbs.component';
import { ConnectedAppNavBar } from './app-nav-bar/connected-app-nav-bar';
import { ConnectedDatasetsReportPage } from '../pages/datasets-report-page/connected-datasets-report-page';
import {
  PATHNAME_DATASETS,
  PATHNAME_DATASET_DETAILS,
  PATHNAME_APIS,
  PATHNAME_CONCEPTS,
  PATHNAME_CONCEPTS_COMPARE,
  PATHNAME_REPORTS,
  PATHNAME_ABOUT,
  PATHNAME_ABOUT_REGISTRATION
} from '../constants/constants';
import '../assets/css/bootstrap-override.scss';
import './styles';

const browser = detect();

export function App(props) {
  const {
    history,
    language,
    datasetTotal,
    apiTotal,
    conceptTotal,
    searchQuery,
    setSearchQuery
  } = props;

  const handleSearchSubmit = searchField => {
    setSearchQuery(searchField, history);
  };

  localization.setLanguage(language);
  const topSectionClass = cx('top-section-search', 'mb-4', {
    'top-section-search--image': !!(browser && browser.name !== 'ie')
  });

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

      <ConnectedAppNavBar />

      <div className="container">
        <div className="row">
          <div className="col-12">
            <Breadcrumbs />
          </div>
        </div>
      </div>

      <section className={topSectionClass}>
        <div className="container">
          <SearchBoxWithState
            onSearchSubmit={handleSearchSubmit}
            searchQuery={searchQuery.q || ''}
            countDatasets={datasetTotal}
            countTerms={conceptTotal}
            countApis={apiTotal}
            open={open}
          />
          <ResultsTabs
            activePath={location.pathname}
            searchParam={location.search}
            countDatasets={datasetTotal}
            countTerms={conceptTotal}
            countApis={apiTotal}
          />
        </div>
      </section>

      <div className="app-routes">
        <Switch>
          <Route
            exact
            path={PATHNAME_DATASETS}
            component={ConnectedSearchPage}
          />
          <Route exact path={PATHNAME_APIS} component={ConnectedSearchPage} />
          <Route
            exact
            path={PATHNAME_CONCEPTS}
            component={ConnectedSearchPage}
          />
          <Route
            exact
            path={`${PATHNAME_CONCEPTS}${PATHNAME_CONCEPTS_COMPARE}`}
            component={ConnectedConceptComparePage}
          />
          <Route
            exact
            path={`${PATHNAME_CONCEPTS}/:id`}
            component={ConnectedConceptDetailsPage}
          />
          <Route
            exact
            path={`${PATHNAME_DATASET_DETAILS}/:id`}
            component={ConnectedDatasetDetailsPage}
          />
          <Route exact path="/apis/:id" component={ConnectedApiDetailsPage} />
          <Route
            exact
            path={PATHNAME_REPORTS}
            component={ConnectedDatasetsReportPage}
          />
          <Route exact path={PATHNAME_ABOUT} component={AboutPage} />
          <Route
            exact
            path={PATHNAME_ABOUT_REGISTRATION}
            component={ArticlePage}
          />
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

App.defaultProps = {
  datasetTotal: null,
  apiTotal: null,
  conceptTotal: null,
  searchQuery: null,
  setSearchQuery: null
};

App.propTypes = {
  language: PropTypes.string.isRequired,
  datasetTotal: PropTypes.number,
  apiTotal: PropTypes.number,
  conceptTotal: PropTypes.number,
  searchQuery: PropTypes.object,
  setSearchQuery: PropTypes.func
};
