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
import { SearchBox } from './search-box/search-box.component';
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
      setQueryFilter('theme', addValue(theme, event.target.value), history);
    } else {
      setQueryFilter('theme', removeValue(theme, event.target.value), history);
    }
  };

  const handleDatasetFilterAccessRights = event => {
    const { accessrights } = searchQuery;
    if (event.target.checked) {
      setQueryFilter(
        'accessrights',
        addValue(accessrights, event.target.value),
        history
      );
    } else {
      setQueryFilter(
        'accessrights',
        removeValue(accessrights, event.target.value),
        history
      );
    }
  };

  const handleDatasetFilterPublisherHierarchy = event => {
    if (event.target.checked) {
      setQueryFilter('orgPath', event.target.value, history);
    } else {
      setQueryFilter('orgPath', undefined, history);
    }
  };

  const handleDatasetFilterProvenance = event => {
    const { provenance } = searchQuery;
    if (event.target.checked) {
      setQueryFilter(
        'provenance',
        addValue(provenance, event.target.value),
        history
      );
    } else {
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
      setQueryFilter('spatial', addValue(spatial, event.target.value), history);
    } else {
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
      setQueryFilter('format', addValue(format, event.target.value), history);
    } else {
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
          <SearchBox
            onSearchSubmit={handleSearchSubmit}
            searchText={searchQuery.q || ''}
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
            render={() => (
              <ResultsDataset
                showFilterModal={showFilterModal}
                closeFilterModal={close}
                datasetItems={datasetItems}
                datasetAggregations={datasetAggregations}
                datasetTotal={datasetTotal}
                onFilterTheme={handleDatasetFilterThemes}
                onFilterAccessRights={handleDatasetFilterAccessRights}
                onFilterPublisherHierarchy={
                  handleDatasetFilterPublisherHierarchy
                }
                onFilterProvenance={handleDatasetFilterProvenance}
                onFilterSpatial={handleDatasetFilterSpatial}
                searchQuery={searchQuery}
                themesItems={themesItems}
                publisherCounts={_.get(datasetAggregations, 'orgPath.buckets')}
                publishers={publisherItems}
                referenceData={referenceData}
                onClearFilters={handleClearFilters}
                setDatasetSort={setDatasetSort}
                onSortByLastModified={sortByLastModified}
                onSortByScore={sortByScore}
                datasetSortValue={datasetSortValue}
                onPageChange={handlePageChange}
                showClearFilterButton={isFilterNotEmpty()}
                hitsPerPage={HITS_PER_PAGE}
              />
            )}
          />
          <Route
            exact
            path={PATHNAME_APIS}
            render={() => (
              <ResultsApi
                showFilterModal={showFilterModal}
                closeFilterModal={close}
                showClearFilterButton={isFilterNotEmpty()}
                apiItems={apiItems}
                apiTotal={apiTotal}
                apiAggregations={apiAggregations}
                onFilterAccessRights={handleDatasetFilterAccessRights}
                onFilterPublisherHierarchy={
                  handleDatasetFilterPublisherHierarchy
                }
                onFilterFormat={handleFilterFormat}
                onClearFilters={handleClearFilters}
                searchQuery={searchQuery}
                publisherCounts={_.get(apiAggregations, 'orgPath.buckets')}
                publishers={publisherItems}
                onSortByLastModified={sortByLastModified}
                onSortByScore={sortByScore}
                onPageChange={handlePageChange}
                hitsPerPage={HITS_PER_PAGE}
                setApiSort={setApiSort}
                apiSortValue={apiSortValue}
              />
            )}
          />
          <Route
            exact
            path={PATHNAME_CONCEPTS}
            render={() => (
              <ResultsConcepts
                showFilterModal={showFilterModal}
                closeFilterModal={close}
                showClearFilterButton={isFilterNotEmpty()}
                conceptItems={conceptItems}
                conceptTotal={conceptTotal}
                conceptAggregations={conceptAggregations}
                onClearFilters={handleClearFilters}
                onFilterPublisherHierarchy={
                  handleDatasetFilterPublisherHierarchy
                }
                searchQuery={searchQuery}
                publisherCounts={_.get(conceptAggregations, 'orgPath.buckets')}
                publishers={publisherItems}
                onSortByLastModified={sortByLastModified}
                onSortByScore={sortByScore}
                onPageChange={handlePageChange}
                hitsPerPage={HITS_PER_PAGE}
                setConceptSort={setConceptSort}
                conceptSortValue={conceptSortValue}
                conceptsCompare={conceptsCompare}
                addConcept={addConcept}
                removeConcept={removeConcept}
              />
            )}
          />
          <Route
            exact
            path={PATHNAME_INFORMATIONMODELS}
            render={() => (
              <ResultsInformationModel
                showFilterModal={showFilterModal}
                closeFilterModal={close}
                showClearFilterButton={isFilterNotEmpty()}
                informationModelItems={informationModelItems}
                informationModelTotal={informationModelTotal}
                informationModelAggregations={informationModelAggregations}
                onFilterPublisherHierarchy={
                  handleDatasetFilterPublisherHierarchy
                }
                onClearFilters={handleClearFilters}
                searchQuery={searchQuery}
                publisherCounts={_.get(
                  informationModelAggregations,
                  'orgPath.buckets'
                )}
                publishers={publisherItems}
                onSortByLastModified={sortByLastModified}
                onSortByScore={sortByScore}
                onPageChange={handlePageChange}
                hitsPerPage={HITS_PER_PAGE}
                setInformationModelSort={setInformationModelSort}
                informationModelSortValue={informationModelSortValue}
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
