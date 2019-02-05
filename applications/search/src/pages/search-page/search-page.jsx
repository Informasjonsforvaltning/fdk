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

import './search-page.scss';
import {
  HITS_PER_PAGE,
  PATHNAME_APIS,
  PATHNAME_CONCEPTS,
  PATHNAME_DATASETS,
  PATHNAME_INFORMATIONMODELS
} from '../../constants/constants';
import { parseSearchParams } from '../../lib/location-history-helper';
import {
  clearFilters,
  isFilterNotEmpty,
  setFilter,
  setMultiselectFilterValue,
  setSearchText
} from './search-location-helper';

const browser = detect();

export const SearchPage = props => {
  const {
    fetchDatasetsIfNeeded,
    fetchApisIfNeeded,
    fetchConceptsIfNeeded,
    fetchThemesIfNeeded,
    fetchPublishersIfNeeded,
    fetchReferenceDataIfNeeded,
    fetchInformationModelsIfNeeded,
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
    showFilterModal,
    open,
    close
  } = props;

  const locationSearch = parseSearchParams(location);

  fetchDatasetsIfNeeded(locationSearch);
  fetchApisIfNeeded(locationSearch);
  fetchConceptsIfNeeded(locationSearch);
  fetchInformationModelsIfNeeded(locationSearch);

  fetchThemesIfNeeded();
  fetchPublishersIfNeeded();
  fetchReferenceDataIfNeeded();

  const handleClearFilters = () => {
    clearFilters(history, location);
  };

  const _isFilterNotEmpty = () => isFilterNotEmpty(location);

  const handleSearchSubmit = searchText => {
    setSearchText(history, location, searchText);
  };

  const handleDatasetFilterThemes = event => {
    const selectedValue = event.target.value;
    const add = event.target.checked;
    setMultiselectFilterValue(history, location, 'theme', selectedValue, add);
  };

  const handleDatasetFilterAccessRights = event => {
    const selectedValue = event.target.value;
    const add = event.target.checked;
    setMultiselectFilterValue(
      history,
      location,
      'accessrights',
      selectedValue,
      add
    );
  };

  const handleDatasetFilterPublisherHierarchy = event => {
    const selectedValue = event.target.value;

    if (event.target.checked) {
      setFilter(history, location, { orgPath: selectedValue });
    } else {
      setFilter(history, location, { orgPath: null });
    }
  };

  const handleDatasetFilterProvenance = event => {
    const selectedValue = event.target.value;
    const add = event.target.checked;
    setMultiselectFilterValue(
      history,
      location,
      'provenance',
      selectedValue,
      add
    );
  };

  const handleDatasetFilterSpatial = event => {
    const selectedValue = event.target.value;
    const add = event.target.checked;
    setMultiselectFilterValue(history, location, 'spatial', selectedValue, add);
  };

  const handleFilterFormat = event => {
    const selectedValue = event.target.value;
    const add = event.target.checked;
    setMultiselectFilterValue(history, location, 'format', selectedValue, add);
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
            searchText={locationSearch.q || ''}
            countDatasets={datasetTotal}
            countTerms={conceptTotal}
            countApis={apiTotal}
            countInformationModels={informationModelTotal}
            open={open}
          />
          <ResultsTabs
            countDatasets={datasetTotal}
            countTerms={conceptTotal}
            countApis={apiTotal}
            countInformationModels={informationModelTotal}
          />
        </div>
      </section>
      <div className="container">
        <Switch>
          <Route exact path={PATHNAME_DATASETS}>
            <ResultsDataset
              showFilterModal={showFilterModal}
              closeFilterModal={close}
              datasetItems={datasetItems}
              datasetAggregations={datasetAggregations}
              datasetTotal={datasetTotal}
              onFilterTheme={handleDatasetFilterThemes}
              onFilterAccessRights={handleDatasetFilterAccessRights}
              onFilterPublisherHierarchy={handleDatasetFilterPublisherHierarchy}
              onFilterProvenance={handleDatasetFilterProvenance}
              onFilterSpatial={handleDatasetFilterSpatial}
              themesItems={themesItems}
              publisherCounts={_.get(datasetAggregations, 'orgPath.buckets')}
              publishers={publisherItems}
              referenceData={referenceData}
              onClearFilters={handleClearFilters}
              showClearFilterButton={_isFilterNotEmpty()}
              hitsPerPage={HITS_PER_PAGE}
            />
          </Route>
          <Route exact path={PATHNAME_APIS}>
            <ResultsApi
              showFilterModal={showFilterModal}
              closeFilterModal={close}
              showClearFilterButton={_isFilterNotEmpty()}
              apiItems={apiItems}
              apiTotal={apiTotal}
              apiAggregations={apiAggregations}
              onFilterAccessRights={handleDatasetFilterAccessRights}
              onFilterPublisherHierarchy={handleDatasetFilterPublisherHierarchy}
              onFilterFormat={handleFilterFormat}
              onClearFilters={handleClearFilters}
              publisherCounts={_.get(apiAggregations, 'orgPath.buckets')}
              publishers={publisherItems}
              hitsPerPage={HITS_PER_PAGE}
            />
          </Route>
          <Route exact path={PATHNAME_CONCEPTS}>
            <ResultsConcepts
              showFilterModal={showFilterModal}
              closeFilterModal={close}
              showClearFilterButton={_isFilterNotEmpty()}
              conceptItems={conceptItems}
              conceptTotal={conceptTotal}
              conceptAggregations={conceptAggregations}
              onClearFilters={handleClearFilters}
              onFilterPublisherHierarchy={handleDatasetFilterPublisherHierarchy}
              publisherCounts={_.get(conceptAggregations, 'orgPath.buckets')}
              publishers={publisherItems}
              hitsPerPage={HITS_PER_PAGE}
              conceptsCompare={conceptsCompare}
              addConcept={addConcept}
              removeConcept={removeConcept}
            />
          </Route>
          <Route exact path={PATHNAME_INFORMATIONMODELS}>
            <ResultsInformationModel
              showFilterModal={showFilterModal}
              closeFilterModal={close}
              showClearFilterButton={_isFilterNotEmpty()}
              informationModelItems={informationModelItems}
              informationModelTotal={informationModelTotal}
              informationModelAggregations={informationModelAggregations}
              onFilterPublisherHierarchy={handleDatasetFilterPublisherHierarchy}
              onClearFilters={handleClearFilters}
              locationSearch={locationSearch}
              publisherCounts={_.get(
                informationModelAggregations,
                'orgPath.buckets'
              )}
              publishers={publisherItems}
              hitsPerPage={HITS_PER_PAGE}
            />
          </Route>
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
