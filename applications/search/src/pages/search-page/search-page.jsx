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
import { getConfig } from '../../config';

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
  setFilter,
  setMultiselectFilterValue,
  setSearchText
} from './search-location-helper';
import localization from '../../lib/localization';
import {
  REFERENCEDATA_PATH_APISTATUS,
  REFERENCEDATA_PATH_DISTRIBUTIONTYPE,
  REFERENCEDATA_PATH_LOS,
  REFERENCEDATA_PATH_THEMES
} from '../../redux/modules/referenceData';

const browser = detect();

export const SearchPage = props => {
  const {
    fetchDatasetsIfNeeded,
    fetchApisIfNeeded,
    fetchConceptsIfNeeded,
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
  const locationSearchParamQ = _.pick(locationSearch, 'q');

  const datasetSearchParams =
    location.pathname === PATHNAME_DATASETS
      ? locationSearch
      : locationSearchParamQ;
  const apiSearchParams =
    location.pathname === PATHNAME_APIS ? locationSearch : locationSearchParamQ;
  const conceptSearchParams =
    location.pathname === PATHNAME_CONCEPTS
      ? locationSearch
      : locationSearchParamQ;
  const informationModelSearchParams =
    location.pathname === PATHNAME_INFORMATIONMODELS
      ? locationSearch
      : locationSearchParamQ;

  fetchDatasetsIfNeeded(datasetSearchParams);
  fetchApisIfNeeded(apiSearchParams);
  fetchConceptsIfNeeded(conceptSearchParams);
  fetchInformationModelsIfNeeded(informationModelSearchParams);
  fetchPublishersIfNeeded();
  fetchReferenceDataIfNeeded(REFERENCEDATA_PATH_DISTRIBUTIONTYPE);
  fetchReferenceDataIfNeeded(REFERENCEDATA_PATH_APISTATUS);
  fetchReferenceDataIfNeeded(REFERENCEDATA_PATH_LOS);
  fetchReferenceDataIfNeeded(REFERENCEDATA_PATH_THEMES);

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

  const handleDatasetFilterLos = event => {
    const selectedValue = event.target.value;
    const add = event.target.checked;
    setMultiselectFilterValue(
      history,
      location,
      'losTheme',
      selectedValue,
      add
    );
  };

  const topSectionClass = cx(
    'top-section-search',
    'mb-4',
    'd-flex',
    'flex-column',
    'justify-content-between',
    {
      'top-section-search--image': !!(browser && browser.name !== 'ie')
    }
  );

  return (
    <div>
      <section className={topSectionClass}>
        <SearchBox
          onSearchSubmit={handleSearchSubmit}
          searchText={locationSearch.q || ''}
          countDatasets={datasetTotal}
          countTerms={conceptTotal}
          countApis={apiTotal}
          countInformationModels={informationModelTotal}
          open={open}
        />
        {!getConfig().themeNap && (
          <ResultsTabs
            countDatasets={datasetTotal}
            countTerms={conceptTotal}
            countApis={apiTotal}
            countInformationModels={informationModelTotal}
          />
        )}
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
              onFilterLos={handleDatasetFilterLos}
              publishers={publisherItems}
              referenceData={referenceData}
              hitsPerPage={HITS_PER_PAGE}
            />
          </Route>
          <Route exact path={PATHNAME_APIS}>
            <ResultsApi
              showFilterModal={showFilterModal}
              closeFilterModal={close}
              apiItems={apiItems}
              apiTotal={apiTotal}
              apiAggregations={apiAggregations}
              onFilterAccessRights={handleDatasetFilterAccessRights}
              onFilterPublisherHierarchy={handleDatasetFilterPublisherHierarchy}
              onFilterFormat={handleFilterFormat}
              publisherCounts={_.get(apiAggregations, 'orgPath.buckets')}
              publishers={publisherItems}
              hitsPerPage={HITS_PER_PAGE}
              referenceData={referenceData}
            />
          </Route>
          <Route exact path={PATHNAME_CONCEPTS}>
            <ResultsConcepts
              showFilterModal={showFilterModal}
              closeFilterModal={close}
              conceptItems={conceptItems}
              conceptTotal={conceptTotal}
              conceptAggregations={conceptAggregations}
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
              informationModelItems={informationModelItems}
              informationModelTotal={informationModelTotal}
              informationModelAggregations={informationModelAggregations}
              onFilterPublisherHierarchy={handleDatasetFilterPublisherHierarchy}
              publisherCounts={_.get(
                informationModelAggregations,
                'orgPath.buckets'
              )}
              publishers={publisherItems}
              hitsPerPage={HITS_PER_PAGE}
            />
          </Route>
        </Switch>
        {!getConfig().themeNap && (
          <div className="twitter-container d-flex justify-content-end mt-5">
            <div className="twitter">
              <h2>{localization.newsFromDatakatalogenOnTwitter}</h2>
              <a
                className="twitter-timeline"
                data-width="600"
                data-height="400"
                href="https://twitter.com/datakatalogen?ref_src=twsrc%5Etfw"
              >
                Tweets by datakatalogen
              </a>
            </div>
          </div>
        )}
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
