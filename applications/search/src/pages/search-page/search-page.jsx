import _ from 'lodash';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import cx from 'classnames';
import { detect } from 'detect-browser';
import { compose, withHandlers, withState } from 'recompose';

import { ResultsDataset } from './results-dataset/results-dataset.component';
import { ResultsConcepts } from './results-concepts/results-concepts.component';
import { ResultsApi } from './results-api/results-api.component';
import { ResultsInformationModel } from './results-informationmodel/results-informationmodel.component';
import { SearchBoxWithState } from './search-box/search-box.component';
import { ResultsTabs } from './results-tabs/results-tabs.component';
import { addValue, removeValue } from '../../lib/stringUtils';

import './search-page.scss';
import {
  HITS_PER_PAGE,
  PATHNAME_APIS,
  PATHNAME_CONCEPTS,
  PATHNAME_DATASETS,
  PATHNAME_INFORMATIONMODELS
} from '../../constants/constants';

const ReactGA = require('react-ga');

const browser = detect();

export const SearchPage = props => {
  const {
    searchQuery,
    setSearchQuery,
    setQueryFilter,
    setQueryPage,
    fetchDatasetsIfNeeded,
    fetchApisIfNeeded,
    fetchConceptsIfNeeded,
    fetchThemesIfNeeded,
    fetchPublishersIfNeeded,
    fetchReferenceDataIfNeeded,
    fetchInformationModelsIfNeeded,
    clearQuery,
    history,
    datasetItems,
    datasetAggregations,
    datasetTotal,
    apiItems,
    apiAggregations,
    apiTotal,
    conceptItems,
    conceptAggregations,
    conceptTotal,
    informationModelItems,
    informationModelAggregations,
    informationModelTotal,
    themesItems,
    publisherItems,
    referenceData,
    location,
    conceptsCompare,
    addConcept,
    removeConcept,
    setDatasetSort,
    setApiSort,
    setConceptSort,
    setInformationModelSort,
    datasetSortValue,
    apiSortValue,
    conceptSortValue,
    informationModelSortValue,
    showFilterModal,
    open,
    close
  } = props;

  fetchDatasetsIfNeeded(searchQuery);
  fetchApisIfNeeded(searchQuery);
  fetchConceptsIfNeeded(searchQuery);
  fetchInformationModelsIfNeeded(searchQuery);

  fetchThemesIfNeeded();
  fetchPublishersIfNeeded();
  fetchReferenceDataIfNeeded();

  const handleClearFilters = () => {
    clearQuery(history);
  };

  const isFilterNotEmpty = () =>
    _.some(
      _.values(
        _.omit(props.searchQuery, ['q', 'page', 'sortfield', 'sortdirection'])
      )
    );

  const handleSearchSubmit = searchField => {
    setSearchQuery(searchField, history);
  };

  const handleDatasetFilterThemes = event => {
    const { theme } = searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til tema',
        label: event.target.value
      });
      setQueryFilter('theme', addValue(theme, event.target.value), history);
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne tema',
        label: event.target.value
      });
      setQueryFilter('theme', removeValue(theme, event.target.value), history);
    }
  };

  const handleDatasetFilterAccessRights = event => {
    const { accessrights } = searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til tilgang',
        label: event.target.value
      });
      setQueryFilter(
        'accessrights',
        addValue(accessrights, event.target.value),
        history
      );
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne tilgang',
        label: event.target.value
      });
      setQueryFilter(
        'accessrights',
        removeValue(accessrights, event.target.value),
        history
      );
    }
  };

  const handleDatasetFilterPublisher = event => {
    const { publisher } = searchQuery;
    if (event.target.checked) {
      setQueryFilter(
        'publisher',
        addValue(publisher, event.target.value),
        history
      );
    } else {
      setQueryFilter(
        'publisher',
        removeValue(publisher, event.target.value),
        history
      );
    }
  };

  const handleDatasetFilterPublisherHierarchy = event => {
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til virksomhet',
        label: event.target.value
      });
      setQueryFilter('orgPath', event.target.value, history);
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne virksomhet',
        label: event.target.value
      });
      setQueryFilter('orgPath', undefined, history);
    }
  };

  const handleDatasetFilterProvenance = event => {
    const { provenance } = searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til opphav',
        label: event.target.value
      });
      setQueryFilter(
        'provenance',
        addValue(provenance, event.target.value),
        history
      );
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne opphav',
        label: event.target.value
      });
      setQueryFilter(
        'provenance',
        removeValue(provenance, event.target.value),
        history
      );
    }
  };

  const handleDatasetFilterSpatial = event => {
    const { spatial } = searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til geografi',
        label: event.target.value
      });
      setQueryFilter('spatial', addValue(spatial, event.target.value), history);
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne geografi',
        label: event.target.value
      });
      setQueryFilter(
        'spatial',
        removeValue(spatial, event.target.value),
        history
      );
    }
  };

  const handleFilterFormat = event => {
    const { format } = searchQuery;
    if (event.target.checked) {
      ReactGA.event({
        category: 'Fasett',
        action: 'Legge til format',
        label: event.target.value
      });
      setQueryFilter('format', addValue(format, event.target.value), history);
    } else {
      ReactGA.event({
        category: 'Fasett',
        action: 'Fjerne format',
        label: event.target.value
      });
      setQueryFilter(
        'format',
        removeValue(format, event.target.value),
        history
      );
    }
  };

  const sortByScore = () => {
    setQueryFilter('sortfield', undefined, history);
  };
  const sortByLastModified = () => {
    const { setQueryFilter, history } = props;
    setQueryFilter('sortfield', 'modified', history);
  };

  const handlePageChange = data => {
    const { selected } = data;

    setQueryPage(selected || undefined, history);
  };

  const topSectionClass = cx('top-section-search', 'mb-4', {
    'top-section-search--image': !!(browser && browser.name !== 'ie')
  });

  return (
    <div>
      <section className={topSectionClass}>
        <div className="container">
          <SearchBoxWithState
            onSearchSubmit={handleSearchSubmit}
            searchQuery={searchQuery.q || ''}
            countDatasets={datasetTotal}
            countTerms={conceptTotal}
            countApis={apiTotal}
            countInformationModels={informationModelTotal}
            open={open}
          />
          <ResultsTabs
            activePath={location.pathname}
            searchParam={location.search}
            countDatasets={datasetTotal}
            countTerms={conceptTotal}
            countApis={apiTotal}
            countInformationModels={informationModelTotal}
          />
        </div>
      </section>
      <div className="container">
        <Switch>
          <Route
            exact
            path={PATHNAME_DATASETS}
            render={props => (
              <ResultsDataset
                datasetItems={datasetItems}
                datasetAggregations={datasetAggregations}
                datasetTotal={datasetTotal}
                onClearFilters={handleClearFilters}
                onFilterTheme={handleDatasetFilterThemes}
                onFilterAccessRights={handleDatasetFilterAccessRights}
                onFilterPublisher={handleDatasetFilterPublisher}
                onFilterPublisherHierarchy={
                  handleDatasetFilterPublisherHierarchy
                }
                onFilterProvenance={handleDatasetFilterProvenance}
                onFilterSpatial={handleDatasetFilterSpatial}
                onPageChange={handlePageChange}
                onSortByLastModified={sortByLastModified}
                onSortByScore={sortByScore}
                searchQuery={searchQuery}
                themesItems={themesItems}
                showFilterModal={showFilterModal}
                showClearFilterButton={isFilterNotEmpty()}
                closeFilterModal={close}
                hitsPerPage={HITS_PER_PAGE}
                publisherCounts={_.get(datasetAggregations, 'orgPath.buckets')}
                publishers={publisherItems}
                referenceData={referenceData}
                setDatasetSort={setDatasetSort}
                datasetSortValue={datasetSortValue}
                {...props}
              />
            )}
          />
          <Route
            exact
            path={PATHNAME_APIS}
            render={props => (
              <ResultsApi
                apiItems={apiItems}
                apiAggregations={apiAggregations}
                apiTotal={apiTotal}
                onClearFilters={handleClearFilters}
                onFilterTheme={handleDatasetFilterThemes}
                onFilterAccessRights={handleDatasetFilterAccessRights}
                onFilterPublisher={handleDatasetFilterPublisher}
                onFilterPublisherHierarchy={
                  handleDatasetFilterPublisherHierarchy
                }
                onFilterFormat={handleFilterFormat}
                onFilterProvenance={handleDatasetFilterProvenance}
                onFilterSpatial={handleDatasetFilterSpatial}
                onPageChange={handlePageChange}
                onSortByLastModified={sortByLastModified}
                onSortByScore={sortByScore}
                searchQuery={searchQuery}
                themesItems={themesItems}
                showFilterModal={showFilterModal}
                showClearFilterButton={isFilterNotEmpty()}
                closeFilterModal={close}
                hitsPerPage={HITS_PER_PAGE}
                publisherCounts={_.get(apiAggregations, 'orgPath.buckets')}
                publishers={publisherItems}
                setApiSort={setApiSort}
                apiSortValue={apiSortValue}
                {...props}
              />
            )}
          />
          <Route
            exact
            path={PATHNAME_CONCEPTS}
            render={props => (
              <ResultsConcepts
                conceptItems={conceptItems}
                conceptAggregations={conceptAggregations}
                conceptTotal={conceptTotal}
                onClearFilters={handleClearFilters}
                onPageChange={handlePageChange}
                onSortByLastModified={sortByLastModified}
                onSortByScore={sortByScore}
                onFilterPublisherHierarchy={
                  handleDatasetFilterPublisherHierarchy
                }
                searchQuery={searchQuery}
                hitsPerPage={HITS_PER_PAGE}
                showFilterModal={showFilterModal}
                closeFilterModal={close}
                showClearFilterButton={isFilterNotEmpty()}
                publisherCounts={_.get(conceptAggregations, 'orgPath.buckets')}
                publishers={publisherItems}
                conceptsCompare={conceptsCompare}
                addConcept={addConcept}
                removeConcept={removeConcept}
                setConceptSort={setConceptSort}
                conceptSortValue={conceptSortValue}
                {...props}
              />
            )}
          />
          <Route
            exact
            path={PATHNAME_INFORMATIONMODELS}
            render={props => (
              <ResultsInformationModel
                informationModelItems={informationModelItems}
                informationModelAggregations={informationModelAggregations}
                informationModelTotal={informationModelTotal}
                onClearFilters={handleClearFilters}
                onFilterTheme={handleDatasetFilterThemes}
                onFilterAccessRights={handleDatasetFilterAccessRights}
                onFilterPublisher={handleDatasetFilterPublisher}
                onFilterPublisherHierarchy={
                  handleDatasetFilterPublisherHierarchy
                }
                onFilterFormat={handleFilterFormat}
                onFilterProvenance={handleDatasetFilterProvenance}
                onFilterSpatial={handleDatasetFilterSpatial}
                onPageChange={handlePageChange}
                onSortByLastModified={sortByLastModified}
                onSortByScore={sortByScore}
                searchQuery={searchQuery}
                themesItems={themesItems}
                showFilterModal={showFilterModal}
                showClearFilterButton={isFilterNotEmpty()}
                closeFilterModal={close}
                hitsPerPage={HITS_PER_PAGE}
                publisherCounts={_.get(
                  informationModelAggregations,
                  'orgPath.buckets'
                )}
                publishers={publisherItems}
                setInformationModelSort={setInformationModelSort}
                informationModelSortValue={informationModelSortValue}
                {...props}
              />
            )}
          />
        </Switch>
      </div>
    </div>
  );
};

const enhance = compose(
  withState('showFilterModal', 'setShowFilterModal', false),
  withHandlers({
    open: props => e => {
      e.preventDefault();
      props.setShowFilterModal(true);
    },
    close: props => e => {
      e.preventDefault();
      props.setShowFilterModal(false);
    }
  })
);

export const SearchPageWithState = enhance(SearchPage);
